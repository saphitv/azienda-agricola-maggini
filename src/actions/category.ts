"use server"
import {categories} from "@/lib/db/schemas/general";
import {eq, InferInsertModel, InferSelectModel, sql} from "drizzle-orm";
import {db} from "@/lib/db";

export type NewCategory = InferInsertModel<typeof categories>;
export type Category = InferSelectModel<typeof categories>

export const getCategoryById = async (id: number): Promise<Category | undefined> => {
    return (await db.select().from(categories).where(eq(categories.id, id)))[0] ?? undefined
}
export const getAllCategoryId = async ():  Promise<{id: number}[]> => {
    return db.select({
        id: categories.id
    }).from(categories);
}


export const upsertCategory = async (category: NewCategory) => {
    await db.insert(categories).values({
        id: category.id,
        nome: category.nome,
        color: category.color,
    })
        .onDuplicateKeyUpdate({
            set: {
                nome: category.nome,
                color: category.color,
            }
        });
}

export const deleteCategory = async (id: number) => {
    await db.delete(categories).where(eq(categories.id, id));
}

export const updateCategory = async (id: number, data: {nome?: string, color?: string}) => {
    const {nome, color} = data;

    return db.update(categories)
        .set({
            nome: nome ? nome : sql`aam_activity_category.nome`,
            color: color ? color : sql`aam_activity_category.color`,
        })
        .where(eq(categories.id, id));
}
