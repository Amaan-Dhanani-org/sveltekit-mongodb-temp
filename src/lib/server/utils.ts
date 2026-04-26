import nodemailer from 'nodemailer';
import { EMAIL_SMTP_PASS, EMAIL_SMTP_USER } from '$env/static/private';
import { User_Model, Session_Model, ChangeCreds_Model } from './models';

/**
 * Generates a 6-digit numeric verification code and a time-to-live (TTL).
 *
 * The code is randomly generated within the range 100000–999999.
 * The TTL is set to 10 minutes from the time of generation.
 *
 * @returns {{ code: number; ttl: Date }} An object containing the verification code and its expiration date.
 */
export function generate_code_and_ttl(): { code: number; ttl: Date } {
    const digits = 6;
    const time = 10; // minutes

    const code = Math.floor(
        Math.pow(10, digits - 1) +
        Math.random() * (Math.pow(10, digits) - Math.pow(10, digits - 1))
    );

    const ttl = new Date(Date.now() + time * 60 * 1000);

    return { code, ttl };
}

type SendEmailParams = {
    to: string;
    subject: string;
    textTpl: string;
    htmlTpl: string;
    data?: Record<string, string>;
};

/**
 * Sends an email using SMTP (Gmail in this configuration).
 *
 * Supports simple template interpolation using `{{key}}` syntax
 * replaced from the `data` object.
 *
 * @param params - Email parameters including recipient, subject, templates, and optional data.
 * @returns {Promise<string | null>} Returns `null` on success or an error message string on failure.
 */
export async function sendEmail({
    to,
    subject,
    textTpl,
    htmlTpl,
    data = {}
}: SendEmailParams): Promise<string | null> {
    const render = (tpl: string) =>
        tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => data[k] ?? '');

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: EMAIL_SMTP_USER,
            pass: EMAIL_SMTP_PASS
        }
    });

    try {
        await transporter.sendMail({
            from: `"Verification" <${EMAIL_SMTP_USER}>`,
            to,
            subject: render(subject),
            text: render(textTpl),
            html: render(htmlTpl)
        });

        return null;
    } catch (err: any) {
        return err instanceof Error ? err.message : String(err);
    }
}

/**
 * Validates password strength against common security requirements.
 *
 * Requirements checked:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one digit
 * - At least one special character
 *
 * @param password - The password string to validate.
 * @returns {string | null} Returns `null` if the password meets all requirements,
 * otherwise returns a human-readable error message.
 */
export function getPwdReqsErr(password: string): string {
    const issues: string[] = [];

    if (!password || password.length < 8) issues.push('at least 8 characters');
    if (!/[A-Z]/.test(password)) issues.push('an uppercase letter');
    if (!/[a-z]/.test(password)) issues.push('a lowercase letter');
    if (!/\d/.test(password)) issues.push('a number');
    if (!/[\W_]/.test(password)) issues.push('a special character');

    if (issues.length === 0) return '';

    const formatter = new Intl.ListFormat('en', {
        style: 'long',
        type: 'conjunction'
    });

    return `Your password needs ${formatter.format(issues)}.`;
}

/**
 * Deletes a user and all associated data linked to the given email.
 *
 * @param email - The email address of the user to be deleted.
 *
 * This operation is permanent and removes all related records tied to the user.
 */
export async function deleteUser(email: string) {
   await User_Model.deleteOne({ email });
   await Session_Model.deleteOne({ email });

   // Expandable to additional collections as the data model grows.
}