import { Suspense } from "react"

import { NavBarWrapper } from "./components/NavBarWrapper"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Suspense>
                <Suspense>
                    {/* @ts-ignore */}
                    <NavBarWrapper />
                </Suspense>
            </Suspense>
            {children}
        </>
    )
}
