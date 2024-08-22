"use client"

import {queryOptions, useQuery} from "@tanstack/react-query";
import {getStatisticsHomepage} from "@/actions/statistics";

export const statisticsOptions = queryOptions({
    queryKey: ['statistics'],
    queryFn: () => getStatisticsHomepage()
})

export function useStatistics(){
    return useQuery(statisticsOptions)
}
