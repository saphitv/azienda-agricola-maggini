"use client"

import {cn} from "@/lib/utils";
import Link from "next/link";
import {ReactComponentLike} from "prop-types";
import {ReactNode} from "react";
import {usePathname} from "next/navigation";

export function NavbarItem({
    item,
                           }: { item: { href: string, icon: ReactNode, title: string}}){
    const pathname = usePathname()
    return (
        <Link
            href={item.href}
            className={cn(
                "flex flex-col items-center justify-center text-sm font-medium text-muted-foreground w-full h-full active:bg-primary-foreground",
                'rounded m-1',
                // item?.disabled && "cursor-not-allowed opacity-80"
                item.href == pathname && 'text-primary font-bold'
            )}
        >
            {item.icon}
            <span className="">{item.title}</span>
        </Link>
    )
}
