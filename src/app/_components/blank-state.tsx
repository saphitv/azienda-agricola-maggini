import {Button} from "@/components/ui/button";
import Link from "next/link";
import {ClipboardList} from "lucide-react";

export function BlankState(){
    return (
        <div className="flex items-center justify-center h-full bg-background">
            <div className="text-center space-y-6">
                <ClipboardList className="w-16 h-16 text-muted-foreground mx-auto"/>
                <h2 className="text-3xl font-bold tracking-tight">Non hai nessun lavoro</h2>
                <p className="text-muted-foreground text-lg max-w-sm mx-auto">
                    Per vedere la dashboard, vai nella tab lavori e creane uno.
                </p>
                <div>
                    <Link href={'/work'}><Button size="lg">Vai alla tab lavori</Button></Link>
                </div>
            </div>
        </div>
    )
}