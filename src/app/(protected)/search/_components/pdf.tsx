"use client"
import {StyleSheet, View, Text, PDFViewer, Page, Document} from "@react-pdf/renderer";
import {useWorks} from "@/hooks/use-work";
import {DateTime} from "luxon";
import {Work} from "@/actions/work";
import {SimpleUser} from "@/types/user";
import {Activity} from "@/actions/activity";
import {activities} from "@/lib/db/schemas/general";

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
        textOverflow: 'ellipsis'
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
    return (
        <Document>
            <Page size='A4'>

                <View style={styles.table}>
                    <Text style={[styles.bold, { fontSize: 20, marginBottom: 20}]}>Lavori periodo
                        {startdate.toLocaleString({day: "2-digit", month: "2-digit", year: "numeric"})} -
                        {enddate.toLocaleString({day: "2-digit", month: "2-digit", year: "numeric"})}
                    </Text>
                    <View style={[styles.row, styles.bold, styles.header]}>
                        <Text style={styles.col1}>Persona</Text>
                        <Text style={styles.col2}>Giorno</Text>
                        <Text style={styles.col3}>Ore</Text>
                        <Text style={styles.col4}>Attività</Text>
                        <Text style={styles.col5}>Nome</Text>
                        <Text style={styles.col6}>Descrizione</Text>
                    </View>
                    {data.map((row, i) => (
                        <View key={i} style={[styles.row, {backgroundColor: i % 2 == 0 ? '' : 'lightgray'}]} wrap={false}>
                            <Text style={styles.col1}>{users.find(user => user.id == row.user_id)?.username}</Text>
                            <Text style={styles.col2}>{DateTime.fromJSDate(row?.day).toLocaleString({ day: "2-digit", month: "short", year: "numeric", hour: "numeric", minute: "numeric", hourCycle: "h24"})}</Text>
                            <Text style={styles.col3}>{row.hour}</Text>
                            <Text style={styles.col4}>{activities.find(act => act.id == row.activity_id)?.nome}</Text>
                            <Text style={styles.col5}>{row.name}</Text>
                            <Text style={styles.col6}>{row.description}</Text>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    )
}
