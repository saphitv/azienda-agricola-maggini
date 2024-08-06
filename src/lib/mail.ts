import {getBaseUrl} from "@/lib/utils";
import nodemailer from "nodemailer";

const domain = getBaseUrl()

const fromEmail = "support@saphi.dev" // "onboarding@resend.dev" default starting email


const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT!),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
})

const sendEmail = async (email: string, subject: string, html: string) => {
    return await transporter.sendMail({
        from: fromEmail,
        to: email,
        subject,
        html
    })
}
export const sendTwoFactorTokenEmail = async (
    email: string,
    token: string
) => {
    await sendEmail(email, "2FA Code", `<p>Your 2FA code: ${token}</p>`)
    /* await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: "2FA Code",
        html: `<p>Your 2FA code: ${token}</p>`
    }); */
};

export const sendPasswordResetEmail = async (
    email: string,
    token: string,
) => {
    const resetLink = `${domain}/new-password?token=${token}`
    await sendEmail(email, "Reset your password", `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`)
    /* await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: "Reset your password",
        html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`
    }); */
};

export const sendVerificationEmail = async (
    email: string,
    token: string
) => {
    const confirmLink = `${domain}/new-verification?token=${token}`;
    await sendEmail(email, "Confirm your email", `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`)
    /*
    await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: "Confirm your email",
        html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`
    }); */
};