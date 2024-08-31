"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {PaginationState, SortingState} from "@tanstack/table-core";
import {DatePickerPreset} from "@/app/(protected)/search/_components/date-picker-preset";
import {DateTime} from "luxon";
import {SelectUsers} from "@/app/(protected)/search/_components/select-users";
import {SelectCategory} from "@/app/(protected)/search/_components/select-category";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    rowCount: number
    setPaginationState: (arg0: PaginationState) => void,
    paginationState: PaginationState,
    sorting: SortingState,
    setSorting: Dispatch<SetStateAction<SortingState>>
    columnFilters: ColumnFiltersState,
    setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>,
    usersFilters: string[],
    setUsersFilters: Dispatch<SetStateAction<string[]>>,
    users: { id: string, username: string | null }[]
    categoryFilters: number[],
    setCategoryFilters: Dispatch<SetStateAction<number[]>>,
}

export type exportFilters = {
    start: DateTime | undefined,
    end:  DateTime | undefined,
}

export function DataTable<TData, TValue>({
                                            columns,
                                            data,
                                            rowCount,
                                            setPaginationState, paginationState,
                                            sorting, setSorting,
                                            columnFilters, setColumnFilters,
                                            usersFilters, users, setUsersFilters,
                                            categoryFilters, setCategoryFilters
                                         }: DataTableProps<TData, TValue>) {
    const [filterDates, setFilterDates] = useState<exportFilters>({
        start: DateTime.now().startOf('month'),
        end: DateTime.now().endOf('month')
    })

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

    useEffect(() => {
        table.getColumn('day')?.setFilterValue(filterDates)
    }, [table, filterDates])


    return (
        <div className='h-full'>
            <div className="flex flex-col items-center py-4 space-y-2">
                <Input
                    placeholder="Filtra per nome o descrizione"
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="w-full"
                />
                <DatePickerPreset dates={filterDates} setDates={setFilterDates} />
                <SelectUsers usersFilters={usersFilters} setUsersFilters={setUsersFilters} users={users} />
                <SelectCategory categoryFilters={categoryFilters} setCategoryFilters={setCategoryFilters} />
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
                {/*<Drawer>
                    <DrawerTrigger asChild>
                        <Button>Crea Lavoro</Button>
                    </DrawerTrigger>

                    <DrawerContent>
                        <FormWork/>
                    </DrawerContent>
                </Drawer>*/}
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
            <div className='flex items-center justify-between'>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                </div>
                <div className=" space-x-2 py-4">
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

        </div>
    )
}
