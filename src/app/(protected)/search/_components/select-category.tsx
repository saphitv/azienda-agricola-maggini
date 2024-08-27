"use client"

import * as React from "react"
import {Check, ChevronsUpDown, Shovel} from "lucide-react"

import {cn, pickTextColorBasedOnBgColorAdvanced} from "@/lib/utils"
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
import {useCategories} from "@/hooks/use-category";
import {Skeleton} from "@/components/ui/skeleton";

export function SelectCategory({setCategoryFilters, categoryFilters}: {
    categoryFilters: number[],
    setCategoryFilters: Dispatch<SetStateAction<number[]>>,
}) {
    const [open, setOpen] = React.useState(false)
    const { data: categories, isPending} = useCategories()
    // const [values, setValues] = React.useState<string[]>([])

    const handleSetValue = (val: string) => {
        if (categoryFilters.includes(+val)) {
            //values.splice(values.indexOf(val), 1);
            setCategoryFilters(categoryFilters.filter((item) => item !== +val));
        } else {
            setCategoryFilters(prevValue => [...prevValue, +val]);
        }
    }

    if(isPending) return <Skeleton className=''/>

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
                        {categoryFilters?.length ?
                            categoryFilters.map((val, i) => (
                                <div key={i} className="px-2 py-1 rounded-xl border text-xs font-medium" style={{
                                    background: categories.find((cat) => cat.id === +val)?.color,
                                    color: pickTextColorBasedOnBgColorAdvanced(categories.find((cat) => cat.id === +val)?.color ?? "#ffffff", '#fff', '#000')
                                }}>
                                    {categories.find((cat) => cat.id === +val)?.nome}
                                </div>
                            ))
                            : <div className='flex flex-row gap-2 items-center'><Shovel className='w-4 h-4'/> Filtra per categoria</div>}
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

                            {categories.map((cat) => (
                                <CommandItem
                                    key={cat.id}
                                    value={cat.id.toString()}
                                    onSelect={() => {
                                        handleSetValue(cat.id.toString())
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            categoryFilters.includes(cat.id) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <div className={'flex items-center gap-2'}>
                                        <div className='w-4 h-4 rounded-full'
                                             style={{background: cat.color}}></div>
                                        {cat.nome}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandList>

                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
