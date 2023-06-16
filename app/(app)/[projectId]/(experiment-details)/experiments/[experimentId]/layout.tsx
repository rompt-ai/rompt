import Link from "next/link"
import dayjs from "dayjs"
import { FolderSymlink } from "lucide-react"

import { getExperiment } from "@/lib/requests/getExperiment"
import BackButton from "@/components/BackButton"
import { DetailedContainer } from "@/components/DetailedContainer"

import { ExperimentEditDropdown } from "./components/ExperimentEditDropdown"

export const dynamic = "force-dynamic"

export default async function Layout({
    children,
    params: { projectId, experimentId },
}: {
    children: React.ReactNode
    params: { projectId: string; experimentId: string }
}) {
    const experiment = await getExperiment(projectId, experimentId)

    if (!experiment) {
        throw new Error("Experiment not found")
    }

    return (
        <DetailedContainer
            title={experiment.name}
            Icon={FolderSymlink}
            subtitle={`Created on ${dayjs(experiment.createdAt).format("MMMM D, YYYY")}`}
            titleAction={
                <Link href={`/${projectId}/experiments`} prefetch={false}>
                    <BackButton />
                </Link>
            }
            tabsProps={{
                tabs: [
                    {
                        title: "Prompts",
                        aliases: ["/launch"],
                        prefetch: false,
                    },
                    {
                        title: "Results",
                        slug: `/results`,
                        disabled: !experiment.didLaunch,
                        prefetch: false,
                    },
                ],
                path: `${projectId}/experiments/${experimentId}`,
            }}
            action={<ExperimentEditDropdown experimentName={experiment.name} />}
        >
            {children}
        </DetailedContainer>
    )
}
