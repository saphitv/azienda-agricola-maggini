"use client"

import {RoleGate} from "@/components/auth/role-gate";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {HoursChart} from "@/app/_components/hours-chart";
import {CategoryChart} from "@/app/_components/category-chart";
import {HoursCard} from "@/app/_components/hours-card";
import {useWorks} from "@/hooks/use-work";
import {BlankState} from "@/app/_components/blank-state";

export function Dashboard() {
    const { data: works, isPending} = useWorks()

    console.log(works, isPending, works?.length)
    if(!isPending && works?.filter(w => !!w).length === 0) return <BlankState/>

    return (
        <div className='flex flex-col space-y-4'>
            <RoleGate allowedRole={"ADMIN"}>
                <div className='space-x-2 '>
                    <Link href={'/category'}><Button variant='secondary'>Categorie</Button></Link>
                    <Link href={'/activity'}><Button variant='secondary'>Attività</Button></Link>
                </div>
            </RoleGate>
            <div className='flex flex-col gap-4 lg:flex-row'>
                <HoursChart/>
                <CategoryChart/>
            </div>
            <HoursCard/>
        </div>
    )
}
