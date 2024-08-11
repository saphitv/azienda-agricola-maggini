"use client"
import {columns} from "@/app/(protected)/activity/_components/columns";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {ArrowLeft} from "lucide-react";
import {useActivities} from "@/hooks/use-activity";
import {DataTable} from "@/app/(protected)/activity/_components/data-table";


export default function Page() {
    const {data, isPending} = useActivities()

    if (isPending) return 'Loading'

    return (
        <div className='p-2 py-4'>
            <div className='flex items-center gap-2'>
                <Link href='/'>
                    <Button variant={'outline'} size={"icon"}>
                        <ArrowLeft />
                    </Button>
                </Link>
                <h4 className='scroll-m-20 text-xl font-bold tracking-tight'>Attività</h4>
            </div>
            <DataTable columns={columns} data={data}/>
        </div>

    )
}
