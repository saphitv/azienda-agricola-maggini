"use client"

import {useSumHoursStatistics} from "@/hooks/use-statistics";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {ChartContainer} from "@/components/ui/chart"

import {Bar, BarChart, LabelList, XAxis, YAxis} from "recharts"
import {DateTime} from "luxon";
import {Skeleton} from "@/components/ui/skeleton";

export const HoursCard = () => {
    const {data, isPending} = useSumHoursStatistics()

    if(isPending) return <Skeleton className='w-full h-96'/>


    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Progressi</CardTitle>
                <CardDescription>
                    Il numero totale di ore lavorate in un anno.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                {data?.data.map((d) => (
                    <div
                        className="grid auto-rows-min gap-2"
                        // @ts-ignore
                        key={d.year ?? Math.random()}
                    >

                        <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                            {d.hour as string}
                            <span className="text-sm font-normal text-muted-foreground">
                        Ore
                        </span>
                        </div>
                        <ChartContainer
                            config={{
                                steps: {
                                    label: "Hours",
                                    color: d.year == DateTime.now().toLocaleString({year: "numeric"}) ? "hsl(var(--chart-1))" : "hsl(var(--muted))",
                                },
                            }}
                            className="aspect-auto h-[32px] w-full"
                        >
                            <BarChart
                                accessibilityLayer
                                layout="vertical"
                                margin={{
                                    left: 0,
                                    top: 0,
                                    right: 0,
                                    bottom: 0,
                                }}
                                data={[
                                    {
                                        date: d.year,
                                        hour: d.hour,
                                    },
                                ]}
                            >
                                <Bar
                                    dataKey="hour"
                                    fill="var(--color-steps)"
                                    radius={4}
                                    barSize={32}
                                >
                                    <LabelList
                                        position="insideLeft"
                                        dataKey="date"
                                        offset={8}
                                        fontSize={12}
                                        fill={d.year == DateTime.now().toLocaleString({year: "numeric"}) ? "white" : "hsl(var(--muted-foreground))"}
                                    />
                                </Bar>
                                <YAxis dataKey="date" type="category" tickCount={1} hide/>

                                <XAxis
                                    dataKey="hour"
                                    type="number"
                                    hide
                                    // @ts-ignore
                                    domain={[0, Math.max(...data?.data.map(d => +d.hour)) * 1.1]}/>
                            </BarChart>
                        </ChartContainer>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
