import {Navigationmenu} from "@/components/navbar/navigation-menu";
import {Separator} from "@/components/ui/separator";
import {UserButton} from "@/components/auth/user-button";
import NavbarLogo from "@/components/navbar/navbar-logo";

export function Navbar() {
    return (
        <>
        <div className="bg-white shadow sticky top-0 z-30">
            <div className="px-2 sm:px-4">
                <div className="flex h-16 justify-between items-center">
                    <div className="flex px-2 items-center">
                        <div className="flex flex-shrink-0 items-center text-xl aspect-square mr-2">
                            <NavbarLogo/>
                        </div>
                        <Separator orientation={'vertical'} className="min-h-8 mr-2"/>
                        <div>
                            <Navigationmenu/>
                        </div>

                    </div>


                    <div className="flex items-center justify-center space-x-4 px-4">

                        <div className="flex justify-center">

                            <UserButton withoutText={true}/>
                        </div>
                    </div>


                </div>
            </div>


        </div>
        </>
    )
}


