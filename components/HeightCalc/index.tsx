"use client"

import { useEffect } from "react"

import useDeviceSize from "@/hooks/use-device-size"

export function HeightCalc() {
    const { height } = useDeviceSize()

    useEffect(() => {
        if (height) {
            const vh = height * 0.01
            document.documentElement.style.setProperty("--vh", `${vh}px`)
        }
    }, [height])

    return <></>
}
