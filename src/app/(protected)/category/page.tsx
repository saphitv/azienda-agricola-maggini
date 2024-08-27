"use client"
import {DataTable} from "@/app/(protected)/category/_components/data-table";
import {columns} from "@/app/(protected)/category/_components/columns";
import {useCategories} from "@/hooks/use-category";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {ArrowLeft, LoaderCircle} from "lucide-react";
import {RoleGate} from "@/components/auth/role-gate";


export default function Page() {
    const {data, isPending} = useCategories()

    if (isPending) return <div className='w-screen h-screen flex items-center justify-center'>
        <LoaderCircle className='animate-spin text-slate-300 w-10 h-10'/>
    </div>

    return (
        <RoleGate allowedRole={"ADMIN"} displayPermission={true}>
            <div className='p-2 py-4'>
                <div className='flex items-center gap-2'>
                    <Link href='/'>
                        <Button variant={'outline'} size={"icon"}>
                            <ArrowLeft/>
                        </Button>
                    </Link>
                    <h4 className='scroll-m-20 text-xl font-bold tracking-tight'>Categorie</h4>
                </div>
                <DataTable columns={columns} data={data}/>
            </div>
        </RoleGate>
    )
}
