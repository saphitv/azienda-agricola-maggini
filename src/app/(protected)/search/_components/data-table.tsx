"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel, getSortedRowModel, SortingFn,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Dispatch, SetStateAction, useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Drawer, DrawerContent, DrawerTrigger} from "@/components/ui/drawer";
import {FormWork} from "@/app/(protected)/work/_components/form-work";
import {PaginationState, SortingState} from "@tanstack/table-core";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    rowCount: number
    setPaginationState: (arg0: PaginationState) => void,
    paginationState: PaginationState,
    sorting: SortingState,
    setSorting: Dispatch<SetStateAction<SortingState>>
    columnFilters: ColumnFiltersState,
    setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>
}

export function DataTable<TData, TValue>({
                                             columns,
                                             data,
                                             rowCount,
                                             setPaginationState, paginationState,
                                             sorting, setSorting,
                                             columnFilters, setColumnFilters
                                         }: DataTableProps<TData, TValue>) {
    const [columnVisibility, setColumnVisibility] =
        useState<VisibilityState>({"id": false})


    const table = useReactTable({
        data,
        columns,
        onColumnVisibilityChange: setColumnVisibility,
        //getPaginationRowModel: getPaginationRowModel(),
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        //getSortedRowModel: getSortedRowModel(),
        //getFilteredRowModel: getFilteredRowModel(),
        rowCount,
        onSortingChange: setSorting,
        manualFiltering: true,
        manualPagination: true,
        manualSorting: true,
        onPaginationChange: pagination => {
            setPaginationState(typeof pagination === 'function'
                ? pagination(paginationState)
                : pagination)
        },
        state: {
            columnVisibility,
            columnFilters,
            pagination: paginationState,
            sorting
        }
    })


    return (
        <div>
            <div className="flex items-center py-4 space-x-2">
                <Input
                    placeholder="Filtra per nome o descrizione"
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                {/*<DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Colonne
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter(
                                (column) => column.getCanHide()
                            )
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
                */}
                <Drawer>
                    <DrawerTrigger asChild>
                        <Button>Crea Lavoro</Button>
                    </DrawerTrigger>

                    <DrawerContent>
                        <FormWork/>
                    </DrawerContent>
                </Drawer>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
