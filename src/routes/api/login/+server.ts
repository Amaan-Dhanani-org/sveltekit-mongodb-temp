import { json, type RequestHandler } from "@sveltejs/kit";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { User_Model, Session_Model } from "$lib/server/models";

export const POST: RequestHandler = async ({ request }) => {
	const { email, password } = await request.json();

	let emailError = "";
	let passwordError = "";

	const dbUser = await User_Model.findOne({ email });

	if (!email) {
		emailError = "Email is required.";
	} else if (!dbUser) {
		emailError = "A user with that email does not exist.";
	} else if (!dbUser.verified) {
		emailError = "Account is unverified. Try registering instead.";
	}

	if (!password) {
		passwordError = "Password is required.";
	} else if (dbUser && !(await bcrypt.compare(password, dbUser.password))) {
		passwordError = "Password is not correct.";
	}

	if (emailError || passwordError) {
		return json(
			{ emailError, passwordError },
			{ status: 400 }
		);
	}

	let session = await Session_Model.findOne({
		userId: dbUser?._id
	});

	let token = "";

	if (!session) {
		let exists = true;

		while (exists) {
			token = crypto.randomBytes(32).toString("hex");
			exists = !!(await Session_Model.findOne({ token }));
		}

		await Session_Model.create({
			userId: dbUser?._id,
			token,
			ttl: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
		});
	} else {
		token = session.token;
	}

	return json({ token });
};