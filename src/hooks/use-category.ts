"use client"
import {queryOptions, useMutation, useQueries, useQuery, useQueryClient} from "@tanstack/react-query";
import {deleteCategory, getAllCategoryId, getCategoryById, NewCategory, upsertCategory} from "@/actions/category";
import {toast} from "sonner"

export const categoryOptions = (id: number | null | undefined) => {
    return queryOptions({
        queryKey: ['categories', id],
        queryFn: () => getCategoryById(id!),
        staleTime: 1000 * 60 * 30, // 30 min,
        enabled: !!id
    })
}

export const categoryIdOptions = () => {
    return queryOptions({
        queryKey: ['categories'],
        queryFn: () => getAllCategoryId(),
        staleTime: 1000 * 60 * 30, // 30 min,
    })
}

export const useCategoryById = (id: number | null | undefined) => {
    return useQuery(categoryOptions(id))
}

export const useCategories = () => {
    const { data } = useQuery(categoryIdOptions())

    return useQueries({
        queries: (data ?? []).map(value => categoryOptions(value.id)),
        combine: (queries) => {
            const isError = queries.some(query => query.status == "error")
            const isPending = queries.some(query => query.status == "pending")
            const data = queries.map((result) => result.data!)
            return {
                isError, isPending, data
            }
        }
    })
}

export const useUpsertCategory = (id?: number) => {
    return useMutation({
        mutationKey: ["category", "upsert", id],
        mutationFn: (category: NewCategory) => upsertCategory(category),
        meta: {
            invalidates: [
                ['categories'],
               id ? ['category', id] : ['something that does not exist']
            ]
        },
        onSuccess: () => {
            toast.success("Modifica avvenuta con successo")
        },
        onError: error => {
            toast.error("Qualcosa è andato storto, riprova")
        }
    })
}

export const useDeleteCategory = (id: number) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["category", "delete", id],
        mutationFn: () => deleteCategory(id),
        onSuccess: async () => {
            queryClient.removeQueries({
                queryKey: ['category', id]
            })

            void queryClient.invalidateQueries({
                queryKey: ['categories']
            })
        }
    })
}
