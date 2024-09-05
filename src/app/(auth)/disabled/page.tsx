import {LockIcon} from "lucide-react";
import {auth} from "@/auth";
import {redirect} from "next/navigation";


export default async function Page(){
    const session = await auth()

    if(session?.user.enabled) redirect('/')

    return (
        <div
            className="flex h-full w-full flex-col items-center justify-center bg-gray-100 px-4 dark:bg-gray-900 overflow-y-hidden">
            <div className="mx-auto max-w-md space-y-4 text-center">
                <LockIcon className="mx-auto h-16 w-16 text-gray-500 dark:text-gray-400"/>
                <h1 className="text-3xl font-bold tracking-tighter text-gray-900 dark:text-gray-50">Account disabilitato</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Il tuo account non è abilitato, per abilitare il tuo account contatta l'amministratore (Simon) tramite messaggio o all&apos;indirizzo email: simonmaggini@gmail.com
                </p>
            </div>
        </div>
    )
}
