"use client"
import {Document, Page, StyleSheet, Text, View} from "@react-pdf/renderer";
import {DateTime} from "luxon";
import {Work} from "@/actions/work";
import {SimpleUser} from "@/types/user";
import {Activity} from "@/actions/activity";

const styles = StyleSheet.create({
    table: {
        width: '100%',
        paddingVertical: '20px',
        paddingHorizontal: '10px',
        fontSize: 11
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        borderTop: '1px solid #EEE',
        paddingTop: 8,
        paddingBottom: 8,
        maxHeight: 80,
        textOverflow: 'ellipsis',
        paddingHorizontal: 4
    },
    header: {
        borderTop: 'none',
    },
    bold: {
        fontWeight: 'bold',
    },
    // So Declarative and unDRY 👌
    col1: {
        width: '10%',
    },
    col2: {
        width: '20%',
    },
    col3: {
        width: '5%',
    },
    col4: {
        width: '15%',
    },
    col5: {
        width: '20%',
    },
    col6: {
        width: '30%',
    },
})



export function PDFLavori({data, startdate, enddate, users, activities}: {
    data: Work[],
    users: SimpleUser[],
    startdate: DateTime,
    enddate: DateTime,
    activities: Activity[]
}){
    const d = Object.entries(Object.groupBy(data, (d) => DateTime.fromJSDate(d.day).toLocaleString({ year: "numeric", month: "long"}, { locale: "it"})))
        // @ts-expect-error added the functionality above
        .map(([xperio, data]) => ([xperio.at(0).toUpperCase() + xperio.slice(1), data, (data ?? []).reduce((acc, curr) => acc + curr.hour, 0)])) as any as [string, Work[], number][]


    return (
        <Document>
            <Page size='A4'>

                <View style={[styles.table]}>
                            <Text style={[styles.bold, { fontSize: 14, marginBottom: 20, borderBottom: "1px solid black", paddingBottom: 2}]}>Lavori dal&nbsp;
                                &quot;{startdate.toLocaleString({day: "2-digit", month: "short", year: "numeric"}, { locale: "it"})}&quot; al&nbsp;
                                &quot;{enddate.toLocaleString({day: "2-digit", month: "short", year: "numeric"}, { locale: "it"})}&quot; con un totale di&nbsp;
                                &quot;{d.reduce((prev, curr) => prev + curr[2], 0)}&quot; Ore
                    </Text>
                    {/*<View style={[styles.row, styles.bold, styles.header]}>
                        <Text style={styles.col1}>Persona</Text>
                        <Text style={styles.col2}>Giorno</Text>
                        <Text style={styles.col3}>Ore</Text>
                        <Text style={styles.col4}>Attività</Text>
                        <Text style={styles.col5}>Nome</Text>
                        <Text style={styles.col6}>Descrizione</Text>
                    </View> */}
                    {d.map(([xperio, rows, total], i) => (
                        <>
                        <View key={xperio + i} style={[{ fontWeight: "bold", fontSize: 18}]}>
                            <Text>{xperio}</Text>
                        </View>
                            <View style={[styles.row, styles.bold, styles.header]}>
                                <Text style={styles.col1}>Persona</Text>
                                <Text style={styles.col2}>Giorno</Text>
                                <Text style={styles.col3}>Ore</Text>
                                <Text style={styles.col4}>Attività</Text>
                                <Text style={styles.col5}>Nome</Text>
                                <Text style={styles.col6}>Descrizione</Text>
                            </View>
                            {rows.map((row, i) => (
                                <View key={i} style={[styles.row, {backgroundColor: i % 2 == 0 ? '' : 'lightgray'}]} wrap={false}>
                                    <Text style={styles.col1}>{users.find(user => user.id == row.user_id)?.username}</Text>
                                    <Text style={styles.col2}>{DateTime.fromJSDate(row?.day).toLocaleString({ day: "2-digit", month: "short", year: "numeric", hour: "numeric", minute: "numeric", hourCycle: "h24"})}</Text>
                                    <Text style={styles.col3}>{row.hour}</Text>
                                    <Text style={styles.col4}>{activities.find(act => act.id == row.activity_id)?.nome}</Text>
                                    <Text style={styles.col5}>{row.name}</Text>
                                    <Text style={styles.col6}>{row.description}</Text>
                                </View>
                            ))}
                            <View key={xperio + i} style={[styles.row, { backgroundColor: '#939393', marginBottom: 30}]}>
                                <Text style={styles.col1}>Totale</Text>
                                <Text style={styles.col2}></Text>
                                <Text style={styles.col3}>{total}</Text>
                            </View>
                        </>
                    ))}
                </View>
            </Page>
        </Document>
    )
}
