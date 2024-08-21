"use server"

import {db} from "@/lib/db";
import {users} from "@/lib/db/schemas/auth";

export async function getAllUsers() {
    return db
        .select({
            id: users.id,
            username: users.name,
        })
        .from(users)
}
