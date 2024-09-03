"use client"
import {useUsers} from "@/hooks/use-users";
import {useCategories} from "@/hooks/use-category";
import {useActivities} from "@/hooks/use-activity";
import {Download, LoaderCircle} from "lucide-react";
import {useEffect, useState} from "react";
import {PaginationState, SortingState} from "@tanstack/table-core";
import {SEARCH_DEFAULT_PAGE, SEARCH_DEFAULT_PAGE_SIZE} from "@/lib/settings";
import {ColumnFiltersState} from "@tanstack/react-table";
import {useWorksFiltered} from "@/hooks/use-work";
import {DateTime} from "luxon";
import {DataTable} from "@/app/(protected)/search/_components/data-table";
import {columns} from "@/app/(protected)/search/_components/columns";
import {PDFDownloadLink} from "@react-pdf/renderer";
import {PDFLavori} from "@/app/(protected)/search/_components/pdf";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";

export function SearchPage(){
    const [paginationState, setPaginationState] = useState<PaginationState>({
        pageSize: SEARCH_DEFAULT_PAGE_SIZE,
        pageIndex: SEARCH_DEFAULT_PAGE
    })

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
        {id: "day", value: [DateTime.now().startOf('month').toISO(), DateTime.now().endOf('month').toISO()]},
        {id: "name", value: ""},
        {id: "user_id", value: []},
        {id: "categoria", value: []}
    ])

    const [sorting, setSorting] = useState<SortingState>([])



    const {data: users, isPending: isUsersPending} = useUsers()
    const { data: categories, isPending: isCategoriesPending} = useCategories()
    const { data: activities, isPending: isActivitiesPending} = useActivities()

    const {data, isPending, rowCount} = useWorksFiltered({
        paginationState,
        sorting,
        columnFilters,
    })

    const {data: dataPDF, isPending: isDataPDFPending} = useWorksFiltered({
        sorting,
        columnFilters,
    })

    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient || isCategoriesPending || isActivitiesPending || isUsersPending) return (
        <div className='w-screen h-screen flex items-center justify-center'>
            <LoaderCircle className='animate-spin text-slate-300 w-10 h-10'/>
        </div>
    )

    const [start, end] = (columnFilters.find(f => f.id == "day")?.value as string[]).map(d => DateTime.fromISO(d))

    return (
        <>
        <div className='flex items-center gap-2 ml-2 justify-between'>
            <h4 className='scroll-m-20 text-xl font-bold tracking-tight'>Cerca lavori</h4>
            {isDataPDFPending ? <Skeleton />: <PDFDownloadLink
                fileName={`Lavori ${start.toLocaleString({
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                })} - ${end.toLocaleString({day: "2-digit", month: "2-digit", year: "numeric"})}`}
                document={<PDFLavori
                    data={dataPDF}
                    activities={activities}
                    users={users ?? []}
                    startdate={start}
                    enddate={end}/>}
            >
                <Button variant='secondary'><Download className='w-5 h-5 mr-3'/>Scarica PDF</Button>
            </PDFDownloadLink>}

        </div>
    <DataTable
        columns={columns}
        data={data.filter(d => d != undefined)}
        rowCount={rowCount ?? 0}
        paginationState={paginationState} setPaginationState={setPaginationState}
        sorting={sorting} setSorting={setSorting}
        columnFilters={columnFilters} setColumnFilters={setColumnFilters}
        users={users ?? []}
    />
        </>
)
}
