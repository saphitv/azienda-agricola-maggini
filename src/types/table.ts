import {PaginationState, SortingState} from "@tanstack/table-core";
import {ColumnFiltersState} from "@tanstack/react-table";
import {exportFilters} from "@/app/(protected)/search/_components/data-table";

export type PaginatedData<T> = {
    result: T[]
    rowCount: number
}

export type PaginationParams = PaginationState
//export type SortParams = { sortBy: `${string}.${'asc' | 'desc'}` }
export type Filters<T> = Partial<T & PaginationParams & {sorting: SortingState} & {  filterValue: string, dateFilterValues: exportFilters, usersFilter: string[], categoryFilter: number[]}>
