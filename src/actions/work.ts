"use server"
import {db} from "@/lib/db";
import {activities, works} from "@/lib/db/schemas/general";
import {and, asc, count, desc, eq, gt, InferInsertModel, like, lt, or, sql} from "drizzle-orm";
import {currentUser} from "@/lib/auth/auth";
import {SEARCH_DEFAULT_PAGE, SEARCH_DEFAULT_PAGE_SIZE} from "@/lib/settings";
import {SortingState} from "@tanstack/table-core";
import {DateTime} from "luxon";
import {inArray} from "drizzle-orm/sql/expressions/conditions";
import {WorkFilters} from "@/hooks/use-work";
import {auth} from "@/auth";

export type Work = {
    id: number;
    name: string;
    description: string | null;
    day: Date;
    hour: number;
    activity_id: number | null;
    user_id: string
}



export type NewWork = InferInsertModel<typeof works>

export const getWorkById = async (id: number): Promise<Work | undefined> => {
    const data =  (await db.select({
        id: works.id,
        name: works.nome,
        description: works.description,
        day: works.day,
        hour: works.ore,
        activity_id: works.activity_id,
            user_id: works.user_id
    }).from(works)
    //    .innerJoin(activitySchema, eq(activitySchema.id, workSchema.activity_id))
        .where(eq(works.id, id))
    )[0] ?? undefined

    return {...data, hour: +data.hour}
}

export const getAllWorkId = async (): Promise<{id: number}[]> => {
    const user = await currentUser()
    return db
        .select({id: works.id})
        .from(works)
        .where(eq(works.user_id, user?.id ?? ""))
        .orderBy(desc(works.day))
}

export const getWorksIdFiltered = async (filters: WorkFilters) => {
    /*const {
        pageIndex = SEARCH_DEFAULT_PAGE,
        pageSize = SEARCH_DEFAULT_PAGE_SIZE,
        sorting,
        filterValue,
        dateFilterValues,
        usersFilter,
        categoryFilter
    } = filtersAndPagination*/
    const session = await auth()

    if(!session) return new Error("Not authenticated")

    const {
        paginationState = { pageIndex: 0, pageSize: 10000},
        sorting,
        columnFilters
    } = filters

    const nameDescriptionFilter = columnFilters?.find(f => f.id == "name")?.value ?? ""
    const [start, end] = columnFilters?.find(f => f.id == "day")?.value.map((data: string) => DateTime.fromISO(data).toJSDate())
    // only admin can filter by user
    const usersFilter: string[] = session.user.role == "ADMIN" ? columnFilters?.find(f => f.id == "user_id")?.value as string[] ?? [] : [session.user.id!]
    const categoryFilter = columnFilters?.find(f => f.id == "categoria")?.value as number[] ?? []


    const allData = db.$with('allData').as(
        db.select({id: works.id, day: works.day})
            .from(works)
            .innerJoin(activities, eq(activities.id, works.activity_id))
            .where(
            and(
                or(
                    or(like(works.nome, `%${nameDescriptionFilter}%`), like(works.description, `%${nameDescriptionFilter}%`),),
                    sql`${nameDescriptionFilter ?? ""} = ''`
                ),
                and(
                    gt(works.day, start ?? DateTime.now().startOf('month').toJSDate()),
                    lt(works.day, end ?? DateTime.now().endOf('month').toJSDate())
                ),
                or(
                    sql`${usersFilter.length} = 0`,
                    inArray(works.user_id, [...usersFilter, "-1"])
                ),
                or(
                    sql`${categoryFilter.length} = 0`,
                    inArray(activities.category_id, [...categoryFilter, -1])
                )
            )
        )
    )

    const cnt = db.$with('cnt').as(
        db.with(allData).select({rowCount: count().as('rowCount')}).from(allData)
    )

    const res =    await db.with(allData, cnt).select({
        id: allData.id,
        rowCount: cnt.rowCount
    }).from(allData).innerJoin(cnt, sql`9 = 9`)
        .offset(paginationState.pageSize * paginationState.pageIndex)
        .limit(paginationState.pageSize)
        .orderBy(sorting?.length == 1 && !sorting[0].desc && sorting[0].id == "day" ? asc(allData.day) : desc(allData.day))

    return {
        result: res,
        rowCount: res[0]?.rowCount ?? 0
    }
}

/*
export const getAllWorks: (month: string, user_id: string | null) => Promise<Work[]> = async (month, user_id) => {
    return db.select({
        id: works.id,
        name: works.nome,
        description: works.description,
        day: works.day,
        hour: works.ore,
        activity_id: works.activity_id,
    }).from(works)
        //.innerJoin(activitySchema, eq(activitySchema.id, workSchema.activity_id))
        .where(
            and(
                or(
                    eq(works.user_id, user_id || "null"),
                    sql`${!!user_id ? '9 = 9' : '9 = 9'}`
                ),
                sql`date_format(aam_work.day, '%m.%y') = ${month}`
            )
        )
        .orderBy(desc(works.day));
}

export const getSearchWorks: (user_id: number, search: string) => Promise<Work[]> = async (user_id, search) => {
    return db.select({
        id: works.id,
        name: works.nome,
        description: works.description,
        day: works.day,
        hour: works.ore,
        activity_id: works.activity_id
    }).from(works)
        //.innerJoin(activitySchema, eq(activitySchema.id, workSchema.activity_id))
        .where(
            and(
                // eq(activitySchema.user_id, user_id),
                or(
                    sql`lower(${works.nome}) like lower(${search + "%"})`,
                    sql`lower(${works.description}) like lower(${"%" + search + "%"})`,
                )
            )
        )
        .orderBy(asc(works.day));
}

*/

export const upsertWork = async (work: Omit<NewWork, 'user_id'>) => {
    const user = await currentUser()

    if(!user?.id) return new Error("Not authenticated")

    await db.insert(works).values({
        id: work.id,
        user_id: user.id,
        nome: work.nome,
        activity_id: work.activity_id,
        description: work.description,
        day: work.day,
        ore: work.ore
    })
        .onDuplicateKeyUpdate({
            set: {
                nome: work.nome,
                activity_id: work.activity_id,
                description: work.description,
                day: work.day,
                ore: work.ore
            }
        });
}


export const deleteWork = async (id: number) => {
    await db.delete(works).where(eq(works.id, id));
}
