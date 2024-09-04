"use client"
import {PDFLavori} from "@/app/(protected)/search/_components/pdf";
import {Button} from "@/components/ui/button";
import {Download} from "lucide-react";
import {PDFViewer} from "@react-pdf/renderer";
import {useUsers} from "@/hooks/use-users";
import {useCategories} from "@/hooks/use-category";
import {useActivities} from "@/hooks/use-activity";
import {useWorksFiltered} from "@/hooks/use-work";
import {DateTime} from "luxon";

export default function Page(){
    const {data: users, isPending: isUsersPending} = useUsers()
    const { data: categories, isPending: isCategoriesPending} = useCategories()
    const { data: activities, isPending: isActivitiesPending} = useActivities()


    const {data: dataPDF, isPending: isDataPDFPending} = useWorksFiltered({
        sorting: [{ id: "day", desc: false }],
        columnFilters: [{ id: "day", value: [DateTime.now().startOf('year').toISO(), DateTime.now().endOf('year').toISO()]}],
    })

    if(isUsersPending || isCategoriesPending || isActivitiesPending || isDataPDFPending) return null

    return (
        <PDFViewer className='w-full h-full' width={600} height={10000}>
            <PDFLavori
                data={dataPDF}
                activities={activities}
                users={users ?? []}
                startdate={DateTime.now().startOf('year')}
                enddate={DateTime.now().endOf('year')}/>
        </PDFViewer>
    )
}