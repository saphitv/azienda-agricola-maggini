"use client"

import {ColumnDef} from "@tanstack/react-table"
import {Category} from "@/actions/category";
import {Drawer, DrawerContent, DrawerTrigger} from "@/components/ui/drawer";
import {Button} from "@/components/ui/button";
import {FormCategoria} from "@/app/(protected)/category/_components/form-categoria";
import {Edit, Trash} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {pickTextColorBasedOnBgColorAdvanced} from "@/lib/utils";
import {useDeleteActivity} from "@/hooks/use-activity";
import {Activity} from "@/actions/activity";
import {useCategoryById} from "@/hooks/use-category";
import {FormActivity} from "@/app/(protected)/activity/_components/form-activity";

export const columns: ColumnDef<Activity>[] = [
    {
        accessorKey: "id",
        header: "Id"
    },
    {
        accessorKey: "nome",
        header: "Nome",
    },
    {
        accessorKey: "category_id",
        header: "Categoria",
        cell: ({ row}) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const { data } = useCategoryById(row.getValue('category_id'))

            return <Badge style={{background: data?.color}}>{data?.nome}</Badge>
        }
    },
    {
        header: "Azioni",
        accessorKey: 'azioni',
        cell: ({row}) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const { mutate } = useDeleteActivity(row.getValue('id'))
            return (
                <div className='space-x-2'>
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button size={"icon"} variant='outline'><Edit className='w-4 h-4'/></Button>
                        </DrawerTrigger>

                        <DrawerContent>
                            <FormActivity activity={{
                                id: row.getValue('id'),
                                category_id: row.getValue('category_id'),
                                nome: row.getValue('nome'),
                            }}/>
                        </DrawerContent>
                    </Drawer>
                    <Button size={"icon"} variant='destructive' onClick={() => mutate()}><Trash className='w-4 h-4'/></Button>
                </div>
            )
        }
    },
]
