"use client";


import {useCurrentRole} from "@/hooks/auth/use-current-role";
import {UserRole} from "@/lib/db/schemas/auth";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {LockIcon} from "lucide-react";

interface RoleGateProps {
    children: React.ReactNode;
    allowedRole: UserRole;
    displayPermission?: boolean
}

export const RoleGate = ({
                             children,
                             allowedRole,
                             displayPermission = false
                         }: RoleGateProps) => {
    const role = useCurrentRole();

    if (role !== allowedRole) {
        if(displayPermission)
            return (
            <>
                <NoPermission/>
            </>

        )
        else
            return null
    }

    return (
        <>
            {children}
        </>
    );
};

function NoPermission() {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center bg-gray-100 px-4 dark:bg-gray-900 overflow-y-hidden">
            <div className="mx-auto max-w-md space-y-4 text-center">
                <LockIcon className="mx-auto h-16 w-16 text-gray-500 dark:text-gray-400"/>
                <h1 className="text-3xl font-bold tracking-tighter text-gray-900 dark:text-gray-50">Accesso negato</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Non hai i permessi per visualizzare questo contenuto. Se credi questo sia un errore contatta l'amministratore di questo sito.
                    believe this is an error.
                </p>
                <div className="flex flex-row gap-2 sm:flex-row">
                    <Link href={'/'} className='w-full'>
                        <Button variant="outline" className='w-full'>
                            Indietro
                        </Button>
                    </Link>
                    <Link href={'/'} className='w-full'>
                        <Button className='w-full'>
                            Home
                        </Button>
                    </Link>


                </div>
            </div>
        </div>
    )
}
