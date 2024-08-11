"use client"
import {DataTable} from "@/app/(protected)/category/_components/data-table";
import {columns} from "@/app/(protected)/category/_components/columns";
import {useCategories} from "@/hooks/use-category";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {ArrowLeft} from "lucide-react";


export default function Page() {
    const {data, isPending} = useCategories()

    if (isPending) return 'Loading'

    return (
        <div className='p-2 py-4'>
            <div className='flex items-center gap-2'>
                    <Link href='/'>
                        <Button variant={'outline'} size={"icon"}>
                            <ArrowLeft />
                        </Button>
                    </Link>
                    <h4 className='scroll-m-20 text-xl font-bold tracking-tight'>Categorie</h4>
            </div>
            <DataTable columns={columns} data={data}/>
        </div>

    )
}
