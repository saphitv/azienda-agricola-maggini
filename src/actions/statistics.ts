"use server"

import {currentUser} from "@/lib/auth/auth";
import {db} from "@/lib/db";
import {activities, categories, works} from "@/lib/db/schemas/general";
import {and, eq, gt, lt, sql, sum} from "drizzle-orm";
import { DateTime } from "luxon";
import {NextResponse} from "next/server";
import {months} from "@/lib/db/schemas/dev";

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
            xperio: months.xperio,
            hours: sql`COALESCE(sum(${works.ore}), 0)`
        })
        .from(months)
        .leftJoin(works,
            and(
                eq(months.day, sql`DATE_FORMAT(${works.day}, '%Y-%m-01')`),
                eq(works.user_id, user.id)
            )
        )
        .where(
            and(
                lt(months.day, sql`now()`),
                gt(months.day, DateTime.now().minus({month: 6}).toJSDate())
            )
        )
        .groupBy(months.xperio)
        .orderBy(months.xperio)


    return {
        status: "success",
        message: "Dati presi con successo",
        data: hourPerMonth
    }
}

export const getSumHoursYear = async () => {
    const user = await currentUser()

    if(!user || !user.id) return {
        status: "error",
        message: 'Unauthorized used',
        data: []
    }



    // @ts-ignore
    const sumHoursYear= await
        db.select({
            year: sql`extract(YEAR from ${works.day})`,
            hour: sql`COALESCE(sum(${works.ore}), 0)`.as('year')
        })
            .from(works)
            .where(
                and(
                    eq(works.user_id, user.id),
                    gt(
                        works.day,
                        sql`${DateTime.now().minus({ year: 1}).startOf('year').toJSDate()}`
                    )
                )
            )
            .groupBy(sql`extract(YEAR from ${works.day})`)



    return {
        status: "success",
        message: "Dati presi con successo",
        data: sumHoursYear
    }
}

export const getHourSortedByCategory = async () => {
    const user = await currentUser()

    if(!user || !user.id) return {
        status: "error",
        message: 'Unauthorized used',
        data: []
    }

    const hourPerCategory = await db
        .select({
            category: categories.nome,
            color: categories.color,
            hours: sum(works.ore).as('hours'),
        })
        .from(works)
        .innerJoin(activities, eq(works.activity_id, activities.id))
        .innerJoin(categories, eq(activities.category_id, categories.id))
        .where(
            and(
                eq(
                    sql`extract(YEAR from ${works.day})`,
                    DateTime.now().toLocaleString({year: "numeric"})
                ),
                eq(works.user_id, user.id)
            )
        )
        .groupBy(categories.nome, categories.color)

    return {
        status: "success",
        message: "Dati presi con successo",
        data: hourPerCategory
    }
}
