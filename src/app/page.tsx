import {useCurrentUser} from "@/hooks/auth/use-current-user";
import {auth} from "@/auth";
import {Dashboard} from "@/app/_components/dashboard";

export default async function Home() {
    //const user = useCurrentUser()
    const session = await auth()
    return (
        <div className='p-4 space-y-2'>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Bentornato {session?.user.name}</h3>
            <div className='flex flex-col space-y-4'>
                <Dashboard session={session}/>
            </div>
        </div>
    );
}
