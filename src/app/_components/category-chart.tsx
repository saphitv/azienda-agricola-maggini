"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

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
import {useCategoryStatistics} from "@/hooks/use-statistics";
import {Skeleton} from "@/components/ui/skeleton";
import {DateTime} from "luxon";
const chartData = [
    { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
    { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
    { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
    { browser: "test", visitors: 173, fill: "var(--color-test)" },
    { browser: "other", visitors: 190, fill: "var(--color-other)" },
]

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    chrome: {
        label: "Chrome",
        color: "hsl(var(--chart-1))",
    },
    safari: {
        label: "Safari",
        color: "hsl(var(--chart-2))",
    },
    firefox: {
        label: "Firefox",
        color: "hsl(var(--chart-3))",
    },
    edge: {
        label: "Edge",
        color: "hsl(var(--chart-4))",
    },
    other: {
        label: "Other",
        color: "hsl(var(--chart-5))",
    },
} satisfies ChartConfig

export function CategoryChart() {
    const { data, isPending } = useCategoryStatistics()



    const totalHours = React.useMemo(() => {
        return data?.data.reduce((acc, curr) => +acc + +(curr.hours ?? 0), 0) ?? 0
    }, [data])

    if(isPending) return <Skeleton className='w-full h-96'/>

    const customChartConfig = Object.fromEntries(
        Object.entries(
            Object.groupBy(data?.data ?? [], data => data.category)
        )
        .map(([key, value], index) => ([key, { label: value![0].category, color: `hsl(var(--chart-${index + 1}))`}]))
    ) satisfies ChartConfig

    return (
        <Card className="flex flex-col w-full">
            <CardHeader className="items-center pb-0">
                <CardTitle>Ore per categoria</CardTitle>
                <CardDescription>Gennaio - {DateTime.now().toLocaleString({ year: "numeric", month: "long"}, { locale: 'it'})}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={customChartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={data?.data.map((value) => (
                                {
                                    ...value,
                                    //fill: value.color,
                                    fill: `var(--color-${value.category})`,
                                    hours: +(value.hours ?? 0)
                                }))}
                            dataKey="hours"
                            nameKey="category"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalHours.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Ore
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="leading-none text-muted-foreground">
                    Mostra le ore di quest`&apos;anno suddivise in categorie.
                </div>
            </CardFooter>
        </Card>
    )
}
