"use client"

import {queryOptions, useQueries, useQuery} from "@tanstack/react-query";
import {getHourSortedByCategory, getStatisticsHomepage, getSumHoursYear} from "@/actions/statistics";

export const statisticsHomepageChartOptions = queryOptions({
    queryKey: ['statistics', 'chart', 'hour'],
    queryFn: () => getStatisticsHomepage()
})

export const statisticsSumHoursOptions = queryOptions({
    queryKey: ['statistics', 'hours'],
    queryFn: () => getSumHoursYear()
})

export const statisticsCategoryOptions = queryOptions({
    queryKey: ['statistics', 'category'],
    queryFn: () => getHourSortedByCategory()
})





export function useHomepageChartStatistics(){
    return useQuery(statisticsHomepageChartOptions)
}

export function useSumHoursStatistics(){
    return useQuery(statisticsSumHoursOptions)
}

export const useCategoryStatistics = () => {
    return useQuery(statisticsCategoryOptions)
}

