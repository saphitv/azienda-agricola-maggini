import NextAuth, { type DefaultSession } from "next-auth";
import {UserRole, UserRoleEnum} from "@/lib/db/schemas/auth";

export type ExtendedUser = DefaultSession["user"] & {
    role: UserRoleEnum;
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
    enabled: boolean,
};

declare module "next-auth" {
    interface Session {
        user: ExtendedUser;
    }
}
