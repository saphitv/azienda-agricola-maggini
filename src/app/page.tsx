"use client"
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useCurrentUser} from "@/hooks/auth/use-current-user";
import {HoursChart} from "@/app/_components/hours-chart";
import {RoleGate} from "@/components/auth/role-gate";
import {HoursCard} from "@/app/_components/hours-card";
import {CategoryChart} from "@/app/_components/category-chart";

export default function Home() {
    const user = useCurrentUser()
    return (
        <div className='p-4 space-y-2'>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Bentornato {user?.name}</h3>
            <div className='flex flex-col space-y-4'>
                <RoleGate allowedRole={"ADMIN"}>
                    <div className='space-x-2 '>
                        <Link href={'/category'}><Button variant='secondary'>Categorie</Button></Link>
                        <Link href={'/activity'}><Button variant='secondary'>Attività</Button></Link>
                    </div>
                </RoleGate>
                <div className='flex flex-col gap-4 lg:flex-row'>
                    <CategoryChart />
                    <HoursChart/>
                </div>
                <HoursCard/>

            </div>
        </div>
    );
}
