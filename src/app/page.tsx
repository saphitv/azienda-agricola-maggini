"use client"
import {db} from "@/lib/db";
import {sql} from "drizzle-orm";
import {useCategories} from "@/hooks/use-category";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useCurrentUser} from "@/hooks/auth/use-current-user";
import {HoursChart} from "@/app/_components/hours-chart";
import {RoleGate} from "@/components/auth/role-gate";

export default function Home() {
  const { data} = useCategories()
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
    <HoursChart />
  </div>
</div>
  );
}
