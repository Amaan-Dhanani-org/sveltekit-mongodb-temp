import type { RequestHandler } from "@sveltejs/kit";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { User_Model, Session_Model } from "$lib/server/models";

export const POST: RequestHandler = async ({ request }) => {
  const { email, password } = await request.json();

  let emailError = "";
  let passwordError = "";

  // === FIND USER === //
  const dbUser = await User_Model.findOne({ email });

  // === EMAIL VALIDATION === //
  if (!email) {
     emailError = "Email is required.";
  } else if (!dbUser) {
    emailError = "A user with that email does not exist.";
  } else if (!dbUser.verified) {
    emailError = "Account is unverified. Try registering instead.";
  }

  // === PASSWORD VALIDATION === //
  if (!password) {
    passwordError = "Password is required.";
  } else if (dbUser && !(await bcrypt.compare(password, dbUser.password))) {
    passwordError = "Password is not correct.";
  }

  // === RETURN ERRORS === //
  if (emailError || passwordError) {
    return new Response(JSON.stringify({ emailError, passwordError }), { status: 400 });
  }

  // === CHECK FOR EXISTING SESSION === //
  let session = await Session_Model.findOne({
    userId: dbUser?._id.toString()
  });

  let token = "";

  // === MAKE NEW SESSION (if no prev. session) === //
  if (!session) {
    let exists = true;

    while (exists) {
      token = crypto.randomBytes(32).toString("hex");
      exists = !!(await Session_Model.findOne({ token }));
    }

    await Session_Model.create({
      userId: dbUser?._id.toString(),
      token,
      ttl: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // a week
    });
  }
  else {
     token = session.token;
  }

  return new Response(JSON.stringify({ token }));

};