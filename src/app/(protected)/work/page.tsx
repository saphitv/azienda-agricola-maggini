"use client"
import {columns} from "@/app/(protected)/work/_components/columns";
import {LoaderCircle} from "lucide-react";
import {DataTable} from "@/app/(protected)/work/_components/data-table";
import {useWorks} from "@/hooks/use-work";
import {useActivities} from "@/hooks/use-activity";
import {useEffect, useState} from "react";


export default function Page() {
    const {isPending: isPendingActivities} = useActivities()
    const {data, isPending} = useWorks()
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient || isPending || isPendingActivities) return (
        <div className='w-screen h-screen flex items-center justify-center'>
            <LoaderCircle className='animate-spin text-slate-300 w-10 h-10'/>
        </div>
    )

    return (
        <div className='p-2 py-4 overflow-y-auto'>
            <div className='flex items-center gap-2 ml-2'>
                <h4 className='scroll-m-20 text-xl font-bold tracking-tight'>I miei Lavori</h4>
            </div>
            <DataTable columns={columns} data={data}/>
        </div>

    )
}
