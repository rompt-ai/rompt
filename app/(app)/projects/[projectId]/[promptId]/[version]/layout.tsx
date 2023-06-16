import Link from "next/link"
import dayjs from "dayjs"
import { AlignLeft } from "lucide-react"

import { getPrompt } from "@/lib/requests/getPrompt"
import BackButton from "@/components/BackButton"
import { DetailedContainer } from "@/components/DetailedContainer"

import PromptActions from "./components/PromptActions"

export default async function Layout({
    children,
    params: { projectId, promptId, version },
}: {
    children: React.ReactNode
    params: { projectId: string; promptId: string; version: string }
}) {
    const prompt = await getPrompt(projectId, promptId, version === "latest" ? "latest" : Number(version))

    return (
        <DetailedContainer
            Icon={AlignLeft}
            title={prompt.name}
            subtitle={`Version ${prompt.version} – Created on ${dayjs(prompt.createdAt).format("MMMM D, YYYY")}`}
            tabsProps={{
                tabs: [
                    {
                        title: "Overview",
                    },
                    {
                        title: "Versions",
                        slug: `/versions`,
                        prefetch: false,
                    },
                    // {
                    //     title: "History",
                    //     slug: `/history`,
                    // },
                ],
                path: `/projects/${prompt.projectId}/${prompt.id}/${prompt.version}`,
            }}
            titleAction={
                <Link href={`/projects/${prompt.projectId}`}>
                    <BackButton />
                </Link>
            }
            action={
                <PromptActions
                    currentWhereVersion={prompt.version}
                    projectId={prompt.projectId}
                    promptId={prompt.id}
                    promptName={prompt.name}
                />
            }
        >
            {children}
        </DetailedContainer>
    )
}
