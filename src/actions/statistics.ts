"use server"

import {currentUser} from "@/lib/auth/auth";
import {db} from "@/lib/db";
import {works} from "@/lib/db/schemas/general";
import {eq, sql, sum} from "drizzle-orm";
import {NextResponse} from "next/server";

export const getStatisticsHomepage = async () => {
    const user = await currentUser()

    if(!user || !user.id) return {
        status: "error",
        message: 'Unauthorized used',
        data: []
    }

    // @ts-ignore
    const hourPerMonth: {xperio: string, hours: number}[] = await db
        .select({
            xperio: sql`extract(YEAR_MONTH from ${works.day})`,
            hours: sql`COALESCE(sum(${works.ore}), 0)`
        })
        .from(works)
        .where(eq(works.user_id, user.id))
        .groupBy(sql`extract(YEAR_MONTH from ${works.day})`)
        .orderBy(sql`extract(YEAR_MONTH from ${works.day})`)


    return {
        status: "success",
        message: "Dati presi con successo",
        data: hourPerMonth
    }
}
