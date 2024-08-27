import {mysqlTable} from "@/lib/db/schemas/auth";
import {datetime, serial, varchar} from "drizzle-orm/mysql-core";

export const months = mysqlTable('dev_month', {
    id: serial("id").primaryKey().autoincrement(),
    day: datetime("day"),
    xperio: varchar("xperio", { length: 7})
})
