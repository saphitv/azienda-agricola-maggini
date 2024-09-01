import {drizzle} from "drizzle-orm/mysql2";
import {createConnection, createPool} from "mysql2";
import * as auth from "./schemas/auth";
import * as dev from "./schemas/dev";

export const schema = {
    ...auth,
    ...dev
}

const connection = createPool({
    host: process.env.PROD == 'true' ? 'db' : 'localhost',
    port: 3306,
    user: process.env.MYSQL_USER!,
    password: process.env.MYSQL_PASSWORD!,
    database: process.env.MYSQL_DATABASE!
})

export const db = drizzle(connection, {
    mode: 'default',
    schema,
})
