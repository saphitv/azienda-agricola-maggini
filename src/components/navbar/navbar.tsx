import {UserButton} from "@/components/auth/user-button";
import {Icons} from "@/lib/icons";
import {currentUser} from "@/lib/auth/auth";
import {NavbarItem} from "@/components/navbar/navbar-item";


const navbarItems = [
    {
        title: "Home",
        href: "/",
        icon: Icons.home,
        mustBeAuthenticated: true,
    },
    {
        title: "Lavori",
        href: '/work',
        icon: Icons.work,
        mustBeAuthenticated: true
    },
    {
        title: "Cerca",
        href: '/search',
        icon: Icons.search,
        mustBeAuthenticated: true
    },
    {
        title: "Accedi",
        href: "/login",
        mustBeAuthenticated: false,
        icon: Icons.login,
    },
    {
        title: "Registrati",
        href: "/register",
        mustBeAuthenticated: false,
        icon: Icons.register,
    },
]

export async function Navbar() {
    const user = await currentUser()
    return (
        <div className="fixed bottom-0 z-40 w-full border-t bg-background pb-[5px] md:pb-0">
            <div className="flex h-16 w-full space-x-4 sm:space-x-2">
                <div className="flex w-full gap-6 md:gap-10">
                    {navbarItems?.length ? (
                        <nav className="flex w-full">
                            {navbarItems?.filter((i) => i.mustBeAuthenticated == !!user?.id)?.map(
                                (item, index) =>
                                    item.href && (
                                        <NavbarItem key={item.href} item={{
                                            ...item,
                                            icon: <item.icon className="h-5 w-5"/>
                                        }}/>
                                    )
                            )}
                            {!!user?.id &&
                            <div className='w-full flex items-center justify-center m-1'>
                                <UserButton withoutText user={user}/>
                            </div>
                            }
                        </nav>
                    ) : null}
                </div>
            </div>
        </div>
    )
}


