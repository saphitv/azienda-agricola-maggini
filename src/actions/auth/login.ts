"use server";

import * as z from "zod";
import { AuthError } from "next-auth";

import { db } from "@/lib/db";
import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas/auth";
import { getTwoFactorTokenByEmail } from "@/lib/db/utils/auth/two-factor-token";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import {
    generateVerificationToken,
    generateTwoFactorToken
} from "@/lib/auth/tokens";
import {
    getTwoFactorConfirmationByUserId
} from "@/lib/db/utils/auth/two-factor-confirmation";
import {twoFactorConfirmations, twoFactorTokens} from "@/lib/db/schemas/auth";
import {eq} from "drizzle-orm";
import {sendTwoFactorTokenEmail, sendVerificationEmail} from "@/lib/mail";
import {getUserByEmail} from "@/lib/db/utils/auth/user";

export const login = async (
    values: z.infer<typeof LoginSchema>,
    callbackUrl?: string | null,
) => {
    console.log("start login")
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { email, password, code } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    console.log(email, existingUser, code)

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Email does not exist!" }
    }

    // se non ha verificato l'email
    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(
            existingUser.email,
        );

        console.log(verificationToken)
        const t = await db.query.verificationTokens.findMany()
        console.log(t)

        if(!verificationToken) return { error: "Something went wrong!" };

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token,
        );

        return { success: "Confirmation email sent!" };
    }



    // se ha il 2fa
    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        // se c'è il codice 2fa
        if (code && code != "") {
            console.log("validating code")
            const twoFactorToken = await getTwoFactorTokenByEmail(
                existingUser.email
            );

            if (!twoFactorToken) {
                return { error: "Invalid code!" };
            }

            if (twoFactorToken.token !== code) {
                return { error: "Invalid code!" };
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date();

            if (hasExpired) {
                return { error: "Code expired!" };
            }

            await db.delete(twoFactorTokens)
                .where(eq(twoFactorTokens.id, twoFactorToken.id));

            const existingConfirmation = await getTwoFactorConfirmationByUserId(
                existingUser.id
            );

            if (existingConfirmation) {
                await db.delete(twoFactorConfirmations)
                    .where(eq(twoFactorConfirmations.id, existingConfirmation.id));
            }

            await db.insert(twoFactorConfirmations).values({
                userId: existingUser.id,
            }).execute();

        } else {
            console.log("creating code")
            // se non c'è il codice lo invia per email
            const twoFactorToken = await generateTwoFactorToken(existingUser.email)
            await sendTwoFactorTokenEmail(
                twoFactorToken.email,
                twoFactorToken.token,
            );


            return { twoFactor: true };
        }
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials!" }
                default:
                    return { error: "Something went wrong!" }
            }
        }

        throw error;
    }

    return { error: "Something unexpected happened"}
};
