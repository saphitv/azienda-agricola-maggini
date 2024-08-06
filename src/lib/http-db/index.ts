import { drizzle } from 'drizzle-orm/mysql-proxy';
import axios from "axios";

export const db = drizzle(async (sql, params, method) => {
    try {
        const rows = await axios.post(`http://${process.env.PROD == 'true' ? 'http-db' : 'localhost'}:3001/query`, { sql, params, method });
        return { rows: rows.data };
    } catch (e: any) {
        console.error('Error from mysql proxy server: ', e.response.data)
        return { rows: [] };
    }
});
