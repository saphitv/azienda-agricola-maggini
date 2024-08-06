import {bigint, datetime, int, mysqlTable, serial, timestamp, varchar} from "drizzle-orm/mysql-core";
import {users} from "@/lib/db/schemas/auth";

export const works = mysqlTable('work', {
    id: int('id').primaryKey().autoincrement(),
    user_id: varchar('user_id', { length: 255 }).references(() => users.id),
    activity_id: int('fk_activity').references(() => activities.id),
    day: datetime('day').notNull(),
    ore: int('ore').notNull(),
    nome: varchar('nome', { length: 255 }).notNull(),
    description: varchar('description', { length: 4000 }),
    createdAt: timestamp("created_at", { mode: 'string'}).defaultNow(),
})

export const activities = mysqlTable('activities', {
    id: int('id').primaryKey().autoincrement(),
    category_id: int('fk_category').references(() => categories.id),
    nome: varchar('nome', { length: 255 }).notNull(),
})

export const categories = mysqlTable('activity_category', {
    id: int('id').primaryKey().autoincrement(),
    nome: varchar('nome', { length: 255 }).notNull(),
    color: varchar('color', { length: 255 }).notNull(),
})
