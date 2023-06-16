import "@/styles/globals.css"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { HeightCalc } from "@/components/HeightCalc"

export const metadata = {
    title: {
        default: "Rompt.ai",
        template: "%s | Rompt.ai",
    },
    description:
        "Generate massive A/B tests from your prompts by leverage our AI-powered system to generate and evaluate prompt variations.",
    colorScheme: "dark",
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='en' className={cn("dark font-sans antialiased")} style={{ colorScheme: "dark" }}>
            <head />
            <body className='app-max-vh-mobile relative'>
                {children}
                <Toaster />
                <HeightCalc />
            </body>
        </html>
    )
}
