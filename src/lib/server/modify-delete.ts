import bcrypt from "bcrypt";
import { generate_code_and_ttl, sendEmail } from "./utils";
import type { Cookies } from "@sveltejs/kit";
import { ChangeCreds_Model, User_Model } from "./models";
import jwt from "jsonwebtoken";
import { SECRET_JWT_KEY } from "$env/static/private";
import { deleteUser } from "./deleteUser";
import { redirect } from "@sveltejs/kit";

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


export async function create_request(
    email: string,
    newEmail: string | undefined,
    type: string,
    password: string,
    cookies: Cookies
): Promise<{ error: string }> {

    // 1. Check if user exists
    const user = await User_Model.findOne({ email });
    if (!user) return { error: 'A user with that email does not exist.' };
    if (!user.verified) return { error: "Account is unverified. Try registering instead." };

    // 2. Clear old requests for this user
    await ChangeCreds_Model.deleteOne({ email });

    if (type === 'Change Password') {
        // Start both operations simultaneously
        const comparePromise = bcrypt.compare(password, user.password);
        const hashPromise = bcrypt.hash(password, 12);

        // Wait for both to finish
        const [isSamePassword, hashedPassword] = await Promise.all([
            comparePromise,
            hashPromise
        ]);

        if (isSamePassword) {
            return {
                error: "I guess your memory is better than you thought! You can't change your password to the one you're already using."
            };
        }

        password = hashedPassword;
    }
    else if (type === 'Change Email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!newEmail || !emailRegex.test(newEmail)) return { error: 'Please enter a valid email.' };

        // Run DB lookup and Bcrypt compare at the same time
        const [passwordCorrect, emailTaken] = await Promise.all([
            bcrypt.compare(password, user.password),
            User_Model.findOne({ email: newEmail })
        ]);

        if (!passwordCorrect) return { error: "Password is not correct." };
        if (emailTaken) return { error: 'This email is already in use by another account.' };
        password = ''; //Don't need it anymore
    }
    else if (type === 'Delete Account') {
        const passwordCorrect = await bcrypt.compare(password, user.password);
        if (!passwordCorrect) return { error: "Password is not correct." };
    }
    else {
        return { error: 'Invalid request type.' };
    }

    const { code, ttl } = generate_code_and_ttl();

    const request = new ChangeCreds_Model({
        email,        // User's current identifier
        newEmail,
        type,
        password,
        code: code.toString(),
        ttl,
        attempts: 0
    });

    try {
        await request.save();

        // If changing email, send code to the NEW email to verify ownership
        const recipient = type === 'Change Email' ? (newEmail ?? '') : email;

        const error = await sendEmail({
            to: recipient,
            subject: 'Hello, here is your verification code',
            textTpl: textTemplate,
            htmlTpl: htmlTemplate,
            data: { code: code.toString() }
        });

        if (error) {
            return { error }
        }

        cookies.set(
            "verify_email",
            jwt.sign({ email }, SECRET_JWT_KEY),
            {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                path: "/",
            }
        );

        return { error: "" };
    } catch (err) {
        return { error: err?.toString() as string };
    }
}

export async function verify_request(
    code: string,
    cookies: Cookies
): Promise<{ error: string, go_back_btn: boolean }> {
    let email: string;
    try {
        email = (jwt.verify(cookies.get("verify_email")!, SECRET_JWT_KEY) as { email: string }).email;
    } catch (err) {
        // tampered token, expired, or missing
        return { error: "Cookies are required to complete registration because we use them to securely verify your email. Please make sure cookies are enabled in your browser settings and register again. If you're using a browser extension or privacy mode that blocks cookies, temporarily disable it for this site.", go_back_btn: true };
    }

    const request = await ChangeCreds_Model.findOne({ email });
    if (!request) return { error: "Your code probably expired. Please try again.", go_back_btn: true };

    if (code.length != 6) {
		return { error: "Your code must be six characters.", go_back_btn: false };
	}

    if (request.code !== code) {
        // increment attempts
        const attempts = (request.attempts || 0) + 1;

        if (attempts >= 3) {
            await ChangeCreds_Model.deleteOne({ _id: request._id });
            return { error: "Too many incorrect attempts. Please register again.", go_back_btn: true };
        } else {
            await ChangeCreds_Model.updateOne(
                { _id: request._id },
                { $set: { attempts } }
            );
            return {
                error: `Incorrect code. You have ${3 - attempts} attempt${3 - attempts === 1 ? '' : 's'} left.`,
                go_back_btn: false
            };
        }
    }

    if (request.type === 'Change Password') {
        await User_Model.updateOne({ email }, { $set: { password: request.password } });
    }
    else if (request.type === 'Change Email') {
        await User_Model.updateOne({ email }, { $set: { email: request.newEmail } });
    }
    else if (request.type === 'Delete Account') {
        deleteUser(email);
    }

    await ChangeCreds_Model.deleteOne({ _id: request._id });
    throw redirect(307, '/logout');
}