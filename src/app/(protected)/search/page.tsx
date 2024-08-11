"use client"
import {columns} from "@/app/(protected)/search/_components/columns";
import {LoaderCircle} from "lucide-react";
import {DataTable} from "@/app/(protected)/search/_components/data-table";
import {useWorks, useWorksFiltered, worksIdFilteredOptions} from "@/hooks/use-work";
import {useActivities} from "@/hooks/use-activity";
import {useEffect, useState} from "react";
import {PaginationState, SortingState} from "@tanstack/table-core";
import {SEARCH_DEFAULT_PAGE, SEARCH_DEFAULT_PAGE_SIZE} from "@/lib/settings";
import {ColumnFiltersState} from "@tanstack/react-table";


export default function Page() {
    const [paginationState, setPaginationState] = useState<PaginationState>({
        pageSize: SEARCH_DEFAULT_PAGE_SIZE,
        pageIndex: SEARCH_DEFAULT_PAGE
    })
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [sorting, setSorting] = useState<SortingState>([])

    const {data, isPending, rowCount} = useWorksFiltered({
        ...paginationState,
        sorting,
        filterValue: columnFilters.filter((value, index) => value.id == 'name')[0]?.value as string ?? ""
    })


    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient || isPending) return (
        <div className='w-screen h-screen flex items-center justify-center'>
            <LoaderCircle className='animate-spin text-slate-300 w-10 h-10'/>
        </div>
    )

    return (
        <div className='p-2 py-4'>
            <div className='flex items-center gap-2 ml-2'>
                <h4 className='scroll-m-20 text-xl font-bold tracking-tight'>I miei Lavori</h4>
            </div>
            <DataTable
                columns={columns}
                data={data}
                rowCount={rowCount ?? 0}
                paginationState={paginationState} setPaginationState={setPaginationState}
                sorting={sorting} setSorting={setSorting}
                columnFilters={columnFilters} setColumnFilters={setColumnFilters}
            />
        </div>

    )
}
