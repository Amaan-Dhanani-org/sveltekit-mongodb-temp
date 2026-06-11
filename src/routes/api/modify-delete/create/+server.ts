import bcrypt from "bcrypt";
import { generate_code_and_ttl, sendEmail, getPwdReqsErr } from "$lib/server/utils";
import { ChangeCreds_Model, User_Model } from "$lib/server/models";
import { json, type RequestHandler } from "@sveltejs/kit";


const textTemplate = `
Use the code below to complete your request:

{{code}}

This code will expire in 10 minutes.

You are receiving this email because a request was made to modify or delete your account.
If you didn't request this, you can safely ignore this message.
`

const htmlTemplate = `
<div style="background-color: #0f172a; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; border-radius: 16px;">
	<div style="text-align: center; margin-bottom: 32px;">
		<h1 style="font-size: 24px; font-weight: 700; color: #fff; margin: 0;">Verify your email</h1>
	</div>

	<div style="background-color: #1e293b; padding: 32px; border-radius: 12px; text-align: center; border: 1px solid #334155;">
		<p style="font-size: 16px; color: #94a3b8; margin-top: 0;">Use the code below to complete your request:</p>
		
		<div style="font-family: 'Courier New', Courier, monospace; font-size: 48px; font-weight: 800; letter-spacing: 8px; color: #38bdf8; margin: 24px 0; padding: 12px; background: #0f172a; border-radius: 8px;">
			{{code}}
		</div>
		
		<p style="font-size: 14px; color: #64748b; margin-bottom: 0;">
			This code expires in <span style="color: #f43f5e; font-weight: 600;">10 minutes</span>.
		</p>
	</div>

	<div style="margin-top: 32px; text-align: center; border-top: 1px solid #334155; padding-top: 24px;">
		<p style="font-size: 13px; color: #475569; line-height: 1.6;">
			You are receiving this email because a request was made to modify or delete your account.
			If you didn't request this, you can safely ignore this message.
		</p>
	</div>
</div>
`

export const POST: RequestHandler = async ({ request }) => {
	const { email: rawEmail, newEmail: rawNewEmail, type, password } = await request.json();

	let emailError = "";
	let newEmailError = "";
	let typeError = "";
	let passwordError = "";

	const email = rawEmail?.trim().toLowerCase();
	const newEmail = rawNewEmail?.trim().toLowerCase();

	const user = await User_Model.findOne({ email });

	if (!user) {
		emailError = "A user with that email does not exist.";
		return json( { emailError }, { status: 400 } );
	} else if (!user.verified) {
		emailError = "Account is unverified. Try registering instead.";
		return json( { emailError }, { status: 400 } );
	}

	if (!password) {
		passwordError = "Password cannot be empty.";
	}

	await ChangeCreds_Model.deleteOne({ email });

	let finalPassword = password;

	if (user) {
		if (type === "Change Password") {
			passwordError = getPwdReqsErr(password);

			const [same, hashed] = await Promise.all([
				bcrypt.compare(password, user.password),
				bcrypt.hash(password, 12)
			]);

			if (same) {
				passwordError = "You can't reuse your current password.";
			} else {
				finalPassword = hashed;
			}

		}

		else if (type === "Change Email") {
			const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

			if (!newEmail || !emailRegex.test(newEmail)) {
				newEmailError = "Please enter a valid new email.";
			} else {
				const [passwordCorrect, emailTaken] = await Promise.all([
					bcrypt.compare(password, user.password),
					User_Model.findOne({ email: newEmail })
				]);

				if (!passwordCorrect) {
					passwordError = "Password is not correct.";
				}

				if (emailTaken) {
					newEmailError = "This email is already in use by an account.";
				}

				finalPassword = "";
			}
		}

		else if (type === "Delete Account") {
			const ok = await bcrypt.compare(password, user.password);

			if (!ok) {
				passwordError = "Password is not correct.";
			}

			finalPassword = ''; // avoid saving raw uneeded password
		}

		else {
			typeError = "Invalid request type.";
		}
	}

	const hasError = () => emailError || passwordError || typeError || newEmailError;
	// reuse SAME return
	if (hasError()) {
		return json(
			{ emailError, passwordError, typeError, newEmailError },
			{ status: 400 }
		);
	}

	const { code, ttl } = generate_code_and_ttl();

	const requestDoc = new ChangeCreds_Model({
		email,
		newEmail,
		type,
		password: finalPassword,
		code: code.toString(),
		ttl,
		attempts: 0
	});

	await requestDoc.save();

	const recipient = type === "Change Email" ? (newEmail ?? "") : email;

	await sendEmail({
		to: recipient,
		subject: 'Hello, here is your verification code',
		textTpl: textTemplate,
		htmlTpl: htmlTemplate,
		data: { code: code.toString() }
	});

	// SINGLE RETURN ONLY
	return json({ email, newEmail });
};