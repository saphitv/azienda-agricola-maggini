import type { Config } from 'drizzle-kit';
import {makeDbString} from "@/utils/db/make-db-string";

export default {
    schema: './src/lib/db/schemas/*',
    out: './drizzle/migrations/mysql',
    dialect: 'mysql',
    dbCredentials: {
        url: makeDbString({
            dbType: 'mysql',
            option: {
                user: process.env.MYSQL_USER!,
                password: process.env.MYSQL_PASSWORD!,
                host: 'localhost',
                port: process.env.MYSQL_PORT as any as number,
                database: process.env.MYSQL_DATABASE!
            }
        }),
    },
    strict: true,

    /* For debugging purposes */
    verbose: true
} satisfies Config;
