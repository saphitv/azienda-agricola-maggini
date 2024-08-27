import { Button } from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {cn} from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import {addDays, format} from "date-fns";
import {DateTime} from "luxon";
import {exportFilters} from "@/app/(protected)/search/_components/data-table";
import {FormLabel} from "@/components/ui/form";
import {Label} from "@/components/ui/label";
import {itCH} from "date-fns/locale";



export function DatePickerPreset({dates, setDates}: {dates: exportFilters, setDates: (dates: exportFilters) => void}){
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
    )
}
