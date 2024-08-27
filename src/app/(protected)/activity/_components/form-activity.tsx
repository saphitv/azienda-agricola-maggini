import {DrawerClose, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle} from "@/components/ui/drawer";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {useCategories, useUpsertCategory} from "@/hooks/use-category";
import {Category} from "@/actions/category";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
// @ts-ignore
import randomcolor from "randomcolor"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import ColorPicker from "@/components/utils/color-picker";
import {Activity} from "@/actions/activity";
import {useUpsertActivity} from "@/hooks/use-activity";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Skeleton} from "@/components/ui/skeleton";

const activitySchema = z.object({
    name: z.string().min(3).max(255),
    category_id: z.number().nullish().refine((value) => value, "Bisogna selezionare una categoria"),
})

export const FormActivity = ({activity}: {
    activity?: Activity
}) => {
    const {mutate} = useUpsertActivity(activity?.id)
    const { data: categories, isPending: isPendingCategories} = useCategories()

    const form = useForm<z.infer<typeof activitySchema>>({
        resolver: zodResolver(activitySchema),
        defaultValues: {
            name: activity?.nome ?? "",
            category_id: activity?.category_id
        }
    })


    const onSubmit = (values: z.infer<typeof activitySchema>) => {
        mutate({ id: activity?.id, nome: values.name, category_id: values.category_id})
    }

    return (
        <div className=''>
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className='px-2'>
                    <DrawerHeader>
                        <DrawerTitle>{activity?.id ? 'Vuoi modificare questa attività?' : 'Vuoi create una nuova attività?'}</DrawerTitle>
                        <DrawerDescription>Questa azione non potrà essere annullata.</DrawerDescription>
                    </DrawerHeader>

                    <div className='space-y-2 px-4'>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel>Nome Attività</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Es. jacky boy" {...field} />
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
                                    {!isPendingCategories ? <Select onValueChange={value => field.onChange(+value)} defaultValue={field.value?.toString()}>


                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleziona una categoria" />
                                        </SelectTrigger>
                                    </FormControl>
                                        <SelectContent>
                                            {categories.map(category => (
                                                <SelectItem value={category?.id?.toString()}
                                                            key={category?.id?.toString()}>
                                                    <div className={'flex items-center gap-2'}>
                                                        <div className='w-4 h-4 rounded-full'
                                                             style={{background: category?.color}}></div>
                                                        {category?.nome}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select> : <Skeleton className='w-full h-10'/>}

                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <DrawerFooter className='flex flex-row'>
                        <DrawerClose className='w-full' asChild>
                            <Button variant="secondary" className='w-full' type="button">Annulla</Button>
                        </DrawerClose>
                        <Button className="w-full" type="submit">{activity?.id ? "Aggiorna" : "Crea"} attività</Button>
                    </DrawerFooter>
                </form>
            </Form>
        </div>
    )
}
