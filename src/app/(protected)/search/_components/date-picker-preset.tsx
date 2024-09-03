import {ArrowLeftFromLine, ArrowRightFromLine} from "lucide-react";
import {DateTime} from "luxon";
import {itCH} from "date-fns/locale";
import {DateTimePicker} from "@/components/datetime-picker";
import {exportFilters} from "@/app/(protected)/search/_components/data-table";


export function DatePickerPreset({dates, setDates}: {dates: exportFilters, setDates: (dates: exportFilters) => void}){
    const [start, end] = dates

    return (
        <div className='w-full flex gap-2 sm:gap-4 flex-col sm:flex-row'>
            <DateTimePicker
                value={start?.toJSDate()}
                onChange={(value) => setDates([DateTime.fromJSDate(value ?? start!.toJSDate()), end])}
                granularity='day'
                weekStartsOn={1}
                displayFormat={{hour24: 'PPP'}}
                locale={itCH}
                icon={<ArrowRightFromLine className="mr-2 h-4 w-4" />}
            />
            <DateTimePicker
                value={end?.toJSDate()}
                onChange={(value) => setDates([start, DateTime.fromJSDate(value ?? end!.toJSDate())])}
                granularity='day'
                weekStartsOn={1}
                displayFormat={{hour24: 'PPP'}}
                locale={itCH}
                icon={<ArrowLeftFromLine  className="mr-2 h-4 w-4" />}
            />
        </div>
    )
/*
    return (
        <CalendarDatePicker
            date={{
            from: dates.start?.toJSDate(),
            to: dates.end?.toJSDate()
            }}
            variant={'outline'}
            onDateSelect={({from, to}) => setDates({start: DateTime.fromJSDate(from), end: DateTime.fromJSDate(to)})}
        />
    )

    return (
        <div className='w-full flex gap-4'>
            <div className='w-full'>
                <Label>Data inizio</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !dates.start && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4"/>
                            {dates.start ? format(dates.start.toJSDate(), "PPP", { locale: itCH}) : <span>Seleziona una data</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                        <Select
                            onValueChange={(value) =>
                                setDates({...dates, start: value ? DateTime.fromISO(value) : undefined})
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select"/>
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectItem value={DateTime.now().startOf('day').toISO()}>Oggi</SelectItem>
                                <SelectItem value={DateTime.now().startOf('month').toISO()}>Inizio mese
                                    corrente</SelectItem>
                                <SelectItem value={DateTime.now().startOf('year').toISO()}>Inizio anno</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="rounded-md border">
                            <Calendar mode="single" selected={dates.start?.toJSDate()} onSelect={value => setDates({
                                ...dates,
                                start: value ? DateTime.fromJSDate(value) : undefined
                            })} locale={itCH}/>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
            <div className='w-full'>
                <Label>Data fine</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !dates.end && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4"/>
                            {dates.end ? format(dates.end.toJSDate(), "PPP", { locale: itCH}) : <span>Seleziona una data</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                        <Select
                            onValueChange={(value) =>
                                setDates({...dates, end: value ? DateTime.fromISO(value) : undefined})
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select"/>
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectItem value={DateTime.now().endOf('day').toISO()}>Oggi</SelectItem>
                                <SelectItem value={DateTime.now().endOf('month').toISO()}>Fine mese
                                    corrente</SelectItem>
                                <SelectItem value={DateTime.now().endOf('year').toISO()}>Fine anno</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="rounded-md border">
                            <Calendar mode="single" selected={dates.end?.toJSDate()} onSelect={value => setDates({
                                ...dates,
                                end: value ? DateTime.fromJSDate(value) : undefined
                            })} locale={itCH}/>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )*/
}
