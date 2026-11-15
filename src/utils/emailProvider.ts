import { Resend } from 'resend';
import { AppError } from '../types/appError.js';
import "dotenv/config";

const resend = new Resend(process.env.RESEND_API);

const sendEmail = async (email: string, subject: string, html: string) => {

    try {
        const result = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: subject,
            html: html
        });

        if (result.error) {
            throw new AppError(result.error.message, 502);
        }

        return result

    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        const message = error instanceof Error ? error.message : "Failed to send email";

        throw new AppError(message, 502);
    }

}

export default sendEmail
