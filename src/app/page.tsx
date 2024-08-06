import {db} from "@/lib/db";
import {sql} from "drizzle-orm";

export default async function Home() {
  const res = await db.execute(sql`SELECT 1 + 1 AS res`)

  return (

    <h1>Response: {JSON.stringify(res)}</h1>
  );
}
