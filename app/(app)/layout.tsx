import { Suspense } from "react"

import { NavBar } from "@/components/NavBar"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Suspense>
                <Suspense>
                    <NavBar />
                </Suspense>
            </Suspense>
            {children}
        </>
    )
}
