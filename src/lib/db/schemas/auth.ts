import type {AdapterAccount, AdapterAccountType} from "@auth/core/adapters"
import {sql} from "drizzle-orm";
import {
    boolean,
    int,
    mysqlTableCreator,
    primaryKey,
    text,
    timestamp,
    uniqueIndex,
    varchar
} from "drizzle-orm/mysql-core";

export type UserRole = "USER" | "ADMIN"

export enum UserRoleEnum {
    USER = "USER",
    ADMIN = "ADMIN",
}

export const mysqlTable = mysqlTableCreator((name) => `${name}`);

export const users = mysqlTable("user", {
    id: varchar("id", { length: 255 })
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: timestamp("emailVerified", {
        mode: "date",
        fsp: 3,
    }),//.default(sql`(CURRENT_TIMESTAMP)`),
    image: varchar("image", { length: 255 }),
    password: varchar("password", { length: 255 }),
    role: text("role", {enum: ["USER", "ADMIN"]}).default("USER"),
    isTwoFactorEnabled: boolean("isTwoFactorEnabled").default(false),
})

export const accounts = mysqlTable(
    "account",
    {
        userId: varchar("userId", { length: 255 })
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: varchar("type", { length: 255 })
            .$type<AdapterAccountType>()
            .notNull(),
        provider: varchar("provider", { length: 255 }).notNull(),
        providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
        refresh_token: varchar("refresh_token", { length: 255 }),
        access_token: varchar("access_token", { length: 255 }),
        expires_at: int("expires_at"),
        token_type: varchar("token_type", { length: 255 }),
        scope: varchar("scope", { length: 255 }),
        id_token: varchar("id_token", { length: 2048 }),
        session_state: varchar("session_state", { length: 255 }),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
    })
)

export const sessions = mysqlTable("session", {
    sessionToken: varchar("sessionToken", { length: 255 }).primaryKey(),
    userId: varchar("userId", { length: 255 })
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = mysqlTable(
    "verificationToken",
    {
        id: varchar("identifier", { length: 255 }).notNull(),
        token: varchar("token", { length: 255 }).notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
        email: varchar("email", { length: 255 }).notNull(),
        userId: varchar("userId", { length: 255 }).references(() => users.id, {onDelete: "cascade"}),
    },
    (verificationToken) => ({
        compositePk: primaryKey({
            columns: [verificationToken.id, verificationToken.token],
        }),
        ui_token: uniqueIndex('token').on(verificationToken.token),
        ui_email_user: uniqueIndex('email_user').on(verificationToken.email, verificationToken.userId),
    })
)

export const passwordResetTokens = mysqlTable(
    "passwordResetToken",
    {
        id: int("id").primaryKey().autoincrement(),
        email: varchar("email", { length: 255 }).notNull(),
        token: varchar("token", { length: 255}).notNull(),
        expires: timestamp("expires").notNull(),
    },
    (table) => ({
        unique: uniqueIndex('UQ_passwordResetToken_emailToken').on(table.email, table.token),
    })
)

export const twoFactorTokens = mysqlTable(
    "twoFactorToken",
    {
        id: int("id").primaryKey().autoincrement(),
        email: varchar("email", { length: 255 }).notNull(),
        token: varchar("token", { length: 255 }).notNull(),
        expires: timestamp("expires").notNull(),
    },
    (table) => ({
        compoundKey: uniqueIndex('UQ_twoFactorTokens_emailToken').on(table.email, table.token),
    })
)

export const twoFactorConfirmations = mysqlTable(
    "twoFactorConfirmation",
    {
        id: int("id").primaryKey().autoincrement(),
        userId: varchar("userId", { length: 255 })
            .notNull()
            .references(() => users.id, {onDelete: "cascade"})
            .unique(),
    },
)



















