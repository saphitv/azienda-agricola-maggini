import {DrawerClose, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle} from "@/components/ui/drawer";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {useUpsertCategory} from "@/hooks/use-category";
import {Category} from "@/actions/category";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
// @ts-ignore
import randomcolor from "randomcolor"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {on} from "next/dist/client/components/react-dev-overlay/pages/bus";
import {Input} from "@/components/ui/input";
import ColorPicker from "@/components/utils/color-picker";

const categorySchema = z.object({
    name: z.string().min(3).max(255),
    color: z.string().refine(value => /^#[0-9A-F]{6}$/i.test(value), {
        message: "Invalid color format",
    }),
})

export const FormCategoria = ({category}: {
    category?: Category
}) => {
    const {mutate} = useUpsertCategory(category?.id)

    const form = useForm<z.infer<typeof categorySchema>>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: category?.nome ?? "",
            color: category?.color ?? randomcolor()
        }
    })


    const onSubmit = (values: z.infer<typeof categorySchema>) => {
        console.log("submit", values)
        mutate({ id: category?.id, nome: values.name, color: values.color})

    }
    return (
        <div className=''>
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className='px-2'>
                    <DrawerHeader>
                        <DrawerTitle>{category?.id ? 'Vuoi modificare questa categoria?' : 'Vuoi create una nuova categoria?'}</DrawerTitle>
                        <DrawerDescription>Questa azione non potrà essere annullata.</DrawerDescription>
                    </DrawerHeader>

                    <div className='space-y-2 px-4'>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel>Nome Categoria</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Es. Vigna" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="color"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Colore</FormLabel>
                                    <FormControl>
                                        <ColorPicker field={field}/>
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
                        <Button className="w-full" type="submit">{category?.id ? "Aggiorna" : "Crea"} categoria</Button>
                    </DrawerFooter>
                </form>
            </Form>
        </div>
    )
}
