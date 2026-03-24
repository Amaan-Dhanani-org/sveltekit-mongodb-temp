import nodemailer from 'nodemailer';
import { EMAIL_SMTP_PASS, EMAIL_SMTP_USER } from '$env/static/private';

export const cookie_options = {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 86400,
} as const;

export function generate_code_and_ttl(): { code: number; ttl: Date } {
    const digits = 6;
    const time = 10; //minutes
    const code = Math.floor(
        Math.pow(10, digits - 1) + Math.random() * (Math.pow(10, digits) - Math.pow(10, digits - 1))
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

export async function sendEmail({ to, subject, textTpl, htmlTpl, data = {} }: SendEmailParams): Promise<string | null> {
    const render = (tpl: string) => tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => data[k] ?? '');
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
