"use client"

import {TrendingDown, TrendingUp} from "lucide-react"
import {Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis} from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {useHomepageChartStatistics} from "@/hooks/use-statistics";
import {DateTime} from "luxon";


const chartConfig = {
    hours: {
        label: "Ore",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export function HoursChart() {
    const { data} = useHomepageChartStatistics()

    const statistics = (data?.data ?? []).map(val => ({
            month: DateTime.fromFormat(val.xperio.toString(), 'yyyy-MM').set({day: 1}),
            label: DateTime.fromFormat(val.xperio.toString(), 'yyyy-MM').set({day: 1}).toLocaleString({ month: "short"}, { locale: 'it'}),
            xperio: val.xperio,
            hours: val.hours
        })
    )

    const currentMonth = statistics.find(val => val.xperio == DateTime.now().startOf('month').toFormat('yyyyMM'))?.hours ?? 0

    const mediaMensile = statistics.length != 0 ?
        statistics.reduce((curr, prev) => +curr + +prev.hours, 0) / statistics.length
        : 1


    const aumentoMeseCorrente = Math.round(currentMonth / mediaMensile * 100 * 10) / 10


    return (
        <Card>
            <CardHeader>
                <CardTitle>Ore per mese</CardTitle>
                <CardDescription>Aprile - Agosto 2024</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={statistics ?? []}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="label"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <YAxis
                            domain={[0, Math.max(...statistics.map(s => +s.hours)) * 1.05]}
                            hide
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />

                        <Bar dataKey="hours" fill="var(--color-hours)" radius={8} >
                            <LabelList
                                dataKey="hours"
                                offset={8}
                                fontSize={12}
                                formatter={(value: number) => value < 5 ? "" : value}
                                fill={'#fff'}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    In {aumentoMeseCorrente > 0 ? "aumento" : "discesa"} del {aumentoMeseCorrente}% questo mese {aumentoMeseCorrente > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4"/>}
                </div>
                <div className="leading-none text-muted-foreground">
                    Mostra il numero di ore degli ultimi mesi
                </div>
            </CardFooter>
        </Card>
    )
}
