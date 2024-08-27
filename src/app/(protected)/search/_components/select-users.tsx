"use client"

import * as React from "react"
import {Check, ChevronsUpDown, Shovel, User} from "lucide-react"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {Dispatch, SetStateAction} from "react";

export function SelectUsers({users, usersFilters, setUsersFilters}: {
    usersFilters: string[],
    setUsersFilters: Dispatch<SetStateAction<string[]>>,
    users: { id: string, username: string | null }[]
}) {
    const [open, setOpen] = React.useState(false)
   // const [values, setValues] = React.useState<string[]>([])

    const handleSetValue = (val: string) => {
        if (usersFilters.includes(val)) {
            //values.splice(values.indexOf(val), 1);
            setUsersFilters(usersFilters.filter((item) => item !== val));
        } else {
            setUsersFilters(prevValue => [...prevValue, val]);
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    <div className="flex gap-2 justify-start">
                        {usersFilters?.length ?
                            usersFilters.map((val, i) => (
                                <div key={i}
                                     className="px-2 py-1 rounded-xl border bg-slate-200 text-xs font-medium">{users.find((user) => user.id === val)?.username}</div>
                            ))
                            : <div className='flex flex-row gap-2 items-center'><User className='w-4 h-4'/> Filtra per persona</div>}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search framework..."/>
                    <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                            <CommandList>

                            {users.map((user) => (
                                <CommandItem
                                    key={user.id}
                                    value={user.id}
                                    onSelect={() => {
                                        handleSetValue(user.id)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            usersFilters.includes(user.id) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {user.username}
                                </CommandItem>
                            ))}
                            </CommandList>

                        </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
