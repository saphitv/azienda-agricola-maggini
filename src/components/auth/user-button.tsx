"use client";

import { FaUser } from "react-icons/fa";
import { ExitIcon, GearIcon } from "@radix-ui/react-icons"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import { LogoutButton } from "@/components/auth/logout-button";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {ShoppingBagIcon} from "lucide-react";
import {Skeleton} from "@/components/ui/skeleton";

export const UserButton = ({withoutText}: {withoutText?: boolean}) => {
    const user = useCurrentUser();
    const router = useRouter();

    if(!user?.id) return <Skeleton className="w-[40px] h-[40px] rounded-full" />

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <div className="flex items-center">
                    <Avatar>
                        <AvatarImage src={user?.image || ""} />
                        <AvatarFallback className="bg-sky-500">
                            <FaUser className="text-white" />
                        </AvatarFallback>
                    </Avatar>
                    {!withoutText &&<span className="text-center ml-2 font-semibold">{user?.name}</span>}
                </div>

            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
                {/* <DropdownMenuItem onClick={() => router.push('/orders')}>
                    <ShoppingBagIcon className="h-4 w-4 mr-2"/>
                    Some Text
                </DropdownMenuItem> */}


                <DropdownMenuItem onClick={() => router.push('/settings')}>
                        <GearIcon className="h-4 w-4 mr-2"/>
                        Settings
                </DropdownMenuItem>

                <LogoutButton>
                    <DropdownMenuItem>
                        <ExitIcon className="h-4 w-4 mr-2" />
                        Logout
                    </DropdownMenuItem>
                </LogoutButton>

            </DropdownMenuContent>
        </DropdownMenu>
    );
};
