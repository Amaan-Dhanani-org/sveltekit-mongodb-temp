import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { Cookies } from "@sveltejs/kit";
import { SECRET_JWT_KEY } from "$env/static/private";
import { User_Model } from "./models";
import { cookie_options } from "./utils";

export async function login_user(
	email: string,
	password: string,
	cookies: Cookies
): Promise<{ error: string }> {
	const dbUser = await User_Model.findOne({ email });

	if (!dbUser) {
		return { error: "A user with that email does not exist." };
	}

	if (!dbUser.verified) { return { error: "Account is unverified. Try registering instead." } };

	const password_is_correct = await bcrypt.compare(password, dbUser.password);
	if (!password_is_correct) {
		return { error: "Password is not correct." };
	}

	const token = jwt.sign({ id: dbUser._id.toString() }, SECRET_JWT_KEY);
	cookies.set("auth-token", token, cookie_options);
	return { error: "" };
}