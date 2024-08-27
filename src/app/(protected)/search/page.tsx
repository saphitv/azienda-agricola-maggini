"use client"
import {columns} from "@/app/(protected)/search/_components/columns";
import {Download, LoaderCircle} from "lucide-react";
import {DataTable} from "@/app/(protected)/search/_components/data-table";
import {useWorksFiltered} from "@/hooks/use-work";
import {useEffect, useState} from "react";
import {PaginationState, SortingState} from "@tanstack/table-core";
import {SEARCH_DEFAULT_PAGE, SEARCH_DEFAULT_PAGE_SIZE} from "@/lib/settings";
import {ColumnFiltersState} from "@tanstack/react-table";
import {Button} from "@/components/ui/button";
import {PDFLavori} from "@/app/(protected)/search/_components/pdf";
import { PDFDownloadLink } from "@react-pdf/renderer";
import {DateTime} from "luxon";
import {useUsers} from "@/hooks/use-users";
import {useCategories} from "@/hooks/use-category";


export default function Page() {
    const [paginationState, setPaginationState] = useState<PaginationState>({
        pageSize: SEARCH_DEFAULT_PAGE_SIZE,
        pageIndex: SEARCH_DEFAULT_PAGE
    })
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const {data: users} = useUsers()
    const { data: categories, isPending: isCategoriesPending} = useCategories()
    const [usersFilters, setUsersFilters] = useState<string[ ]>([])
    const [categoryFilters, setCategoryFilters] = useState<number[ ]>([])
    const [sorting, setSorting] = useState<SortingState>([])

    const {data, isPending, rowCount} = useWorksFiltered({
        ...paginationState,
        sorting,
        filterValue: columnFilters.filter((value, index) => value.id == 'name')[0]?.value as string ?? "",
        dateFilterValues: columnFilters.filter((value, index) => value.id == 'day')[0]?.value as any,
        usersFilter: (users ?? [])
            .filter(user => usersFilters.length == 0 || usersFilters.includes(user.id))
            .map(user => user.id),
        categoryFilter: (!categories || isCategoriesPending ? [] : categories)
            .filter(cat => categoryFilters.length == 0 || categoryFilters.includes(cat.id))
            .map(cat => cat.id)
    })

    const {start = DateTime.now().startOf('month'), end = DateTime.now().endOf('month')} = columnFilters.filter((value, index) => value.id == 'day')[0]?.value as any ?? {}


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
        <div className='p-2 py-4 overflow-y-auto'>
            <div className='flex items-center gap-2 ml-2 justify-between'>
                <h4 className='scroll-m-20 text-xl font-bold tracking-tight'>Cerca lavori</h4>
                <PDFDownloadLink
                    fileName={`Lavori ${start.toLocaleString({day: "2-digit", month: "2-digit", year: "numeric"})} - ${end.toLocaleString({day: "2-digit", month: "2-digit", year: "numeric"})}`}
                    document={<PDFLavori
                        data={data}
                        users={users ?? []}
                        startdate={start}
                        enddate={end}/>}
                >
                    <Button variant='secondary'><Download className='w-5 h-5 mr-3'/>Scarica PDF</Button>
                </PDFDownloadLink>

            </div>
            <DataTable
                columns={columns}
                data={data}
                rowCount={rowCount ?? 0}
                paginationState={paginationState} setPaginationState={setPaginationState}
                sorting={sorting} setSorting={setSorting}
                columnFilters={columnFilters} setColumnFilters={setColumnFilters}
                usersFilters={usersFilters} setUsersFilters={setUsersFilters} users={users ?? []}
                categoryFilters={categoryFilters} setCategoryFilters={setCategoryFilters}
            />
        </div>

    )
}
