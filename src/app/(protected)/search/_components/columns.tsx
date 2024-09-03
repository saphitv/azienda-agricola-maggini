"use client"

import {ColumnDef, FilterFn} from "@tanstack/react-table"
import {useActivityById} from "@/hooks/use-activity";
import {Work} from "@/actions/work";
import {Drawer, DrawerContent, DrawerTrigger} from "@/components/ui/drawer";
import {Button} from "@/components/ui/button";
import {ArrowUpDown, Edit, Trash} from "lucide-react";
import {useDeleteWork} from "@/hooks/use-work";
import {FormWork} from "@/app/(protected)/work/_components/form-work";
import {DateTime} from "luxon";
import {useCategoryById} from "@/hooks/use-category";
import {Badge} from "@/components/ui/badge";
import {useUsers} from "@/hooks/use-users";

const filterFunction: FilterFn<Work> = (row, columnId, filterValue) => {
    const searchableRowContent = `${row.original.name} ${row.original.description}`;

    // Perform a case-insensitive comparison
    return searchableRowContent.toLowerCase().includes(filterValue.toLowerCase());
}

const isWithinRange: FilterFn<Work> = (row, columnId, filterValue, addMeta) => {
    const date = DateTime.fromJSDate(row.getValue(columnId))

    const {start, end} = filterValue as { start?: DateTime, end?: DateTime}

    if(start && start.diff(date).toMillis() < 0) return false

    if(end && end.diff(date).toMillis() > 0) return false

    return true

}


export const columns: ColumnDef<Work>[] = [
    {
        accessorKey: "id",
        header: "Id"
    },
    {
        accessorKey: "user_id",
        header: "User",
        cell: ({row}) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const { data: users} = useUsers()

            return (users ?? []).find(user => user.id == row.getValue('user_id'))?.username ?? ""
        }
    },
    {
        accessorKey: "day",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Giorno
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({row}) => {
            const day = row.getValue('day') as Date

            if(!day) return 'Loading ...'

            return (
                <div className='w-32'>
                    {DateTime.fromJSDate(row.getValue('day')).toLocaleString({
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hourCycle: "h24"
                    }, { locale: 'it'})}
                </div>
            )
        },
        filterFn: isWithinRange
    },
    {
        accessorKey: "hour",
        header: "Ore",
    },
    {
        accessorKey: "categoria",
        header: "Categoria",
        cell: ({row}) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const { data: activity } = useActivityById(row.getValue('activity_id'))
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const { data: category } = useCategoryById(activity?.category_id)


            return (
                <Badge style={{background: category?.color}}>
                    {category?.nome}
                </Badge>
            )
        }
    },
    {
        accessorKey: "activity_id",
        header: "Attività",
        cell: ({row}) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const { data } = useActivityById(row.getValue('activity_id'))

            return data?.nome
        }
    },
    {
        header: "Nome",
        accessorKey: 'name',
        //filterFn: filterFunction
    },
    {
        header: "Descrizione",
        accessorKey: 'description',
        cell: ({row}) => (
            <div className={'w-60'}>{row.getValue('description')}</div>
        )
    },
    {
        header: "Azioni",
        accessorKey: 'azioni',
        cell: ({row}) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const { mutate } = useDeleteWork(row.getValue('id'))
            return (
                <div className='flex gap-x-2'>
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button size={"icon"} variant='outline'><Edit className='w-4 h-4'/></Button>
                        </DrawerTrigger>

                        <DrawerContent>
                            <FormWork work={{
                                id: row.getValue('id'),
                                day: row.getValue('day'),
                                activity_id: row.getValue('activity_id'),
                                hour: row.getValue('hour'),
                                name: row.getValue('name'),
                                description: row.getValue('description'),
                            }}/>
                        </DrawerContent>
                    </Drawer>
                    <Button size={"icon"} variant='destructive' onClick={() => mutate()}><Trash className='w-4 h-4'/></Button>
                </div>
            )
        }
    },
]
