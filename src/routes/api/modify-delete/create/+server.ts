import type { RequestHandler } from './$types';
import bcrypt from 'bcrypt';
import { User_Model } from '$lib/server/models';
import { sendEmail } from '$lib/server/utils';
import { generate_code_and_ttl } from '$lib/server/utils';

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
    const { type, email: rawEmail, password, newEmail: rawNewEmail } = await request.json();

   let emailError = '';
   let passwordError = '';
   let typeError = '';

   const email = rawEmail?.trim().toLowerCase();
   const newEmail = rawNewEmail?.trim().toLowerCase();

   const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

   if (!emailRegex.test(email)) {
        emailError = 'Please enter a valid email address.';
   }

   if (!emailRegex.test(newEmail)) {
        emailError = 'Please enter a valid new email address.';
   }