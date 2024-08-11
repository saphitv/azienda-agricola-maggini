"use server"
import {db} from "@/lib/db";
import {activities, categories} from "@/lib/db/schemas/general";
import {eq, InferInsertModel, InferSelectModel} from "drizzle-orm";
import {Category} from "@/actions/category";

export type NewActivity = InferInsertModel<typeof activities>;
export type Activity = InferSelectModel<typeof activities>

export const getAllActivitiesId = async (): Promise<{id: number}[]> => {
    return db
        .select({
            id: activities.id,
        })
        .from(activities)
        //.innerJoin(categories, eq(activities.category_id, categories.id));
}

export const getActivityById = async (id: number):  Promise<Activity | undefined> => {
    return (await db.select().from(activities).where(eq(activities.id, id)))[0] ?? undefined
    //.innerJoin(categories, eq(activities.category_id, categories.id));
}


const addActivity = async (activity: NewActivity) => {
    await db.insert(activities).values(activity);
}

export const deleteActivity = async (id: number) => {
    await db.delete(activities).where(eq(activities.id, id));
}

export const upsertActivity = async (activity: NewActivity) => {
    await db.insert(activities)
        .values({
            id: activity.id,
            nome: activity.nome,
            category_id: activity.category_id,
        })
        .onDuplicateKeyUpdate({
            set: {
                nome: activity.nome,
                category_id: activity.category_id,
            }
        });
}
