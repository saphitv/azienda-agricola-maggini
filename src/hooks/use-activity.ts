import {queryOptions, useMutation, useQueries, useQuery, useQueryClient} from "@tanstack/react-query";
import {deleteActivity, getActivityById, getAllActivitiesId, NewActivity, upsertActivity} from "@/actions/activity";
import {toast} from "sonner";

export const activityOptions = (id: number) => {
    return queryOptions({
        queryKey: ['activities', id],
        queryFn: () => getActivityById(id),
        staleTime: 1000 * 60 * 30, // 30 min,
        enabled: !!id
    })
}

export const activityIdOptions = () => {
    return queryOptions({
        queryKey: ['activities'],
        queryFn: () => getAllActivitiesId(),
        staleTime: 1000 * 60 * 30, // 30 min,
    })
}

export const useActivityById = (id: number) => useQuery(activityOptions(id))

export const useActivities = () => {
    const { data } = useQuery(activityIdOptions())

    return useQueries({
        queries: (data ?? []).map(value => activityOptions(value.id)),
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

export const useUpsertActivity = (id?: number) => {
    return useMutation({
        mutationKey: ["activity", "upsert", id],
        mutationFn: (activity: NewActivity) => upsertActivity(activity),
        meta: {
            invalidates: [
                ['activities'],
                id ? ['activities', id] : ['something that does not exist']
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

export const useDeleteActivity = (id: number) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["activity", "delete", id],
        mutationFn: () => deleteActivity(id),
        onSuccess: async () => {
            queryClient.removeQueries({
                queryKey: ['activities', id]
            })

            void queryClient.invalidateQueries({
                queryKey: ['activities']
            })
        }
    })
}
