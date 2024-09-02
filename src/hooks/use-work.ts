"use client"
import {keepPreviousData, queryOptions, useMutation, useQueries, useQuery, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner"
import {deleteWork, getAllWorkId, getWorkById, getWorksIdFiltered, NewWork, upsertWork, Work} from "@/actions/work";
import {Filters} from "@/types/table";


export type WorkFilters = Filters<Work>

export const workOptions = (id: number) => {
    return queryOptions({
        queryKey: ['works', id],
        queryFn: () => getWorkById(id),
        staleTime: 1000 * 60 * 30, // 30 min,
        enabled: !!id
    })
}

export const worksIdOptions = () => {
    return queryOptions({
        queryKey: ['works'],
        queryFn: () => getAllWorkId(),
        staleTime: 1000 * 60 * 30, // 30 min,
    })
}



export const worksIdFilteredOptions = (filters: WorkFilters) => {
    return queryOptions({
        queryKey: ['works', filters],
        queryFn: () => getWorksIdFiltered({
            ...filters,
            dateFilterValues: {
                start: filters.dateFilterValues?.start?.toHTTP(),
                end: filters.dateFilterValues?.end?.toHTTP(),
            },
            usersFilter: filters.usersFilter ?? [],
            categoryFilter: filters.categoryFilter ?? []
        }),
        placeholderData: keepPreviousData
    })
}

export const useWorksFiltered = (filters: WorkFilters) => {
    const {data: DBData} = useQuery(worksIdFilteredOptions(filters))

    return useQueries({
        queries: (DBData?.result || []).map(value => workOptions(value.id)),
        combine: (queries) => {
            const isError = queries.some(query => query.status == "error")
            const isPending = queries.some(query => query.status == "pending")
            const data = queries.map((result) => result.data!)

            return {
                isError, isPending, data, rowCount: DBData?.rowCount
            }
        }
    })
}

export const useWorkById = (id: number) => {
    return useQuery(workOptions(id))
}

export const useWorks = () => {
    const { data, isPending: isPendingId } = useQuery(worksIdOptions())

    return useQueries({
        queries: (data ?? []).map(value => workOptions(value.id)),
        combine: (queries) => {
            const isError = queries.some(query => query.status == "error")
            const isPending = queries.some(query => query.status == "pending") || isPendingId
            const data = queries.map((result) => result.data!)
            return {
                isError, isPending, data
            }
        }
    })
}

export const useUpsertWork = (id?: number) => {
    return useMutation({
        mutationKey: ["work", "upsert", id],
        mutationFn: (work: Omit<NewWork, 'user_id'>) => upsertWork(work),
        meta: {
            invalidates: [
                ['works'],
               id ? ['works', id] : ['something that does not exist']
            ]
        },
        onSuccess: () => {
            toast.success("Modifica avvenuta con successo")
        },
        onError: _error => {
            toast.error("Qualcosa è andato storto, riprova")
        }
    })
}

export const useDeleteWork = (id: number) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["work", "delete", id],
        mutationFn: () => deleteWork(id),
        onSuccess: async () => {
            queryClient.removeQueries({
                queryKey: ['works', id]
            })

            void queryClient.invalidateQueries({
                queryKey: ['works']
            })
        }
    })
}
