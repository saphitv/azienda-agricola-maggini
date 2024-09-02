import {DrawerClose, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle} from "@/components/ui/drawer";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
// @ts-ignore
import randomcolor from "randomcolor"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useActivities} from "@/hooks/use-activity";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {Skeleton} from "@/components/ui/skeleton";
import {Work} from "@/actions/work";
import {useUpsertWork} from "@/hooks/use-work";
import {DateTimePicker} from "@/components/datetime-picker";
import {Textarea} from "@/components/ui/textarea";
import {DateTime} from "luxon";
import {useCategories} from "@/hooks/use-category";
import {Badge} from "@/components/ui/badge";
import {useEffect} from "react";
import { itCH } from 'date-fns/locale'

const workSchema = z.object({
    day: z.date(),
    hour: z.number(),
    category_id: z.number().nullish(),
    activity_id: z.number().nullish().refine((value) => value, "Bisogna selezionare un'attività"),
    name: z.string().max(255),
    description: z.string().max(1000)
})

export const FormWork = ({work}: {
    work?: Omit<Work, 'user_id'>
}) => {
    const {mutate} = useUpsertWork(work?.id)
    const { data: activities, isPending: isPendingActivities} = useActivities()
    const { data: categories, isPending: isPendingCategory } = useCategories()

    const currentCategory = (activities ?? []).find(act => act.id == work?.activity_id)?.category_id ?? null


    const form = useForm<z.infer<typeof workSchema>>({
        resolver: zodResolver(workSchema),
        defaultValues: {
            day: work?.day ?? DateTime.now().startOf('hour').toJSDate(),
            // @ts-ignore
            hour: work?.hour ?? "",
            category_id: currentCategory,
            activity_id: work?.activity_id,
            name: work?.name ?? "",
            description: work?.description ?? "",
        }
    })

    const { category_id, activity_id } = form.watch()

    useEffect(() => {
        if(activities.find(act => act.id == activity_id)?.category_id != category_id)
            form.setValue("activity_id", null)
    }, [category_id, activity_id, activities, form])


    const onSubmit = (values: z.infer<typeof workSchema>) => {
        mutate({
            id: work?.id,
            nome: values.name,
            day: values.day,
            activity_id: values.activity_id,
            description: values.description,
            ore: values.hour,
        })
    }

    return (
        <div className=''>
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className='px-2'>
                    <DrawerHeader>
                        <DrawerTitle>{work?.id ? 'Vuoi modificare questa lavoro?' : 'Vuoi creare un nuovo lavoro?'}</DrawerTitle>
                        <DrawerDescription>Questa azione non potrà essere annullata.</DrawerDescription>
                    </DrawerHeader>

                    <div className='space-y-2 px-4'>
                        <FormField
                            control={form.control}
                            name="day"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-2">
                                    <FormLabel>Ora inizio</FormLabel>
                                    <FormControl>
                                        <DateTimePicker
                                            value={field.value}
                                            onChange={field.onChange}
                                            granularity='hour'
                                            weekStartsOn={1}
                                            displayFormat={{hour24: 'PPP HH:00'}}
                                            locale={itCH}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="hour"
                            render={({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel>Ore</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Inserisci il numero di ore che hai lavorato" type={"number"} value={field.value} onChange={e => field.onChange(+e.target.value)}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="category_id"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Categoria</FormLabel>
                                    {!isPendingCategory && !isPendingCategory ? <Select onValueChange={value => field.onChange(+value)} defaultValue={field.value?.toString()}>


                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleziona una categoria" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map(category => (
                                                <SelectItem value={category?.id?.toString()} key={category?.id?.toString()}>
                                                    <div className={'flex items-center gap-2'}>
                                                        <div className='w-4 h-4 rounded-full' style={{background: category?.color}}></div> {category?.nome}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select> : <Skeleton className='w-full h-10'/>}

                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="activity_id"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Attività</FormLabel>
                                    {!isPendingActivities ? <Select onValueChange={value => field.onChange(+value)} defaultValue={field.value?.toString()}>

                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleziona un'attività" />
                                        </SelectTrigger>
                                    </FormControl>
                                        <SelectContent>
                                            {Object.entries(Object.groupBy(activities, act => act?.category_id ?? "other"))
                                                .filter(([key]) => category_id == null || (category_id?.toString() ?? "") == key)
                                                .map(([key, listActivity], index) => (
                                                <SelectGroup key={key}>
                                                    <SelectLabel>{categories.find(cat => cat?.id.toString() == key)?.nome}</SelectLabel>
                                                    {(listActivity ?? []).map(activity => (
                                                        <SelectItem value={activity?.id?.toString()} key={activity?.id?.toString()}>{activity?.nome}</SelectItem>
                                                    ))}
                                                </SelectGroup>

                                            ))}
                                        </SelectContent>
                                    </Select> : <Skeleton className='w-full h-10'/>}

                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel>Nome (opzionale)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Es. Tagliato ronco nonni" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel>Descrizione (opzionale)</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} placeholder='Se si vuole aggiungere informazioni aggiuntive (es. Non sono riuscito a tagliare quel ronco ...)' />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <DrawerFooter className='flex flex-row'>
                        <DrawerClose className='w-full' asChild>
                            <Button variant="secondary" className='w-full' type="button">Annulla</Button>
                        </DrawerClose>
                        <Button className="w-full" type="submit">{work?.id ? "Aggiorna" : "Crea"} lavoro</Button>
                    </DrawerFooter>
                </form>
            </Form>
        </div>
    )
}
