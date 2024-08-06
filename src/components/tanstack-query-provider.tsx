"use client"
import {matchQuery, MutationCache, QueryClient, QueryClientProvider, QueryKey} from "@tanstack/react-query";
import {ReactNode, Suspense, useState} from "react";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

declare module '@tanstack/react-query' {
    interface Register {
        mutationMeta: {
            invalidates?: Array<QueryKey>
        }
    }
}

export function TanstackQueryProvider({children}: { children: ReactNode}){
    const [queryClient] = useState(new QueryClient({
        mutationCache: new MutationCache({
            onSuccess: (data, _variables, _context, mutation) => {
                void  queryClient.invalidateQueries({
                    predicate: (query) =>
                        // invalidate all matching tags at once
                        // or everything if no meta is provided
                        mutation.meta?.invalidates?.some((queryKey) =>
                            matchQuery({ queryKey }, query)
                        ) ?? true,
                })
            },
        }),
    }))

    return (
        <QueryClientProvider client={queryClient}>
                {children}
            <Suspense fallback={null}>
                <ReactQueryDevtools initialIsOpen={false} position="left"/>
            </Suspense>

        </QueryClientProvider>
    )
}