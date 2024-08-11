"use client"

import {ColumnDef} from "@tanstack/react-table"
import {Category, deleteCategory} from "@/actions/category";
import {Drawer, DrawerContent, DrawerTrigger} from "@/components/ui/drawer";
import {Button} from "@/components/ui/button";
import {FormCategoria} from "@/app/(protected)/category/_components/form-categoria";
import {Edit, Trash} from "lucide-react";
import {RoleGate} from "@/components/auth/role-gate";
import {useDeleteCategory} from "@/hooks/use-category";
import {Badge} from "@/components/ui/badge";
import {pickTextColorBasedOnBgColorAdvanced} from "@/lib/utils";

export const columns: ColumnDef<Category>[] = [
    {
        accessorKey: "id",
        header: "Id"
    },
    {
        accessorKey: "nome",
        header: "Nome",
    },
    {
        accessorKey: "color",
        header: "Colore",
        cell: ({ row}) => {
            return (
                <Badge style={{
                    background: row.getValue('color'),
                    color: pickTextColorBasedOnBgColorAdvanced(row.getValue('color'), '#fff', '#000')
                }}>{row.getValue('color')}</Badge>
            )
        }
    },
    {
        header: "Azioni",
        accessorKey: 'azioni',
        cell: ({row}) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const { mutate } = useDeleteCategory(row.getValue('id'))
            return (
                <div className='space-x-2'>
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button size={"icon"} variant='outline'><Edit className='w-4 h-4'/></Button>
                        </DrawerTrigger>

                        <DrawerContent>
                            <FormCategoria category={{
                                id: row.getValue('id'),
                                color: row.getValue('color'),
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
