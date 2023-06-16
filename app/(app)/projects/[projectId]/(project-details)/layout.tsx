import dayjs from "dayjs"
import { FolderSymlink } from "lucide-react"

import { getProject } from "@/lib/requests/getProject"
import { DetailedContainer } from "@/components/DetailedContainer"

import { ProjectEditDropdown } from "../components/ProjectEditDropdown"
import { ContainerAction } from "./components/ContainerAction"
import { SmartBackButton } from "./components/SmartBackButton"

export const dynamic = "auto"

export default async function Layout({ children, params: { projectId } }: { children: React.ReactNode; params: { projectId } }) {
    const project = await getProject(projectId)

    if (!project) {
        throw new Error("Project not found")
    }

    return (
        <DetailedContainer
            title={project.name}
            Icon={FolderSymlink}
            subtitle={`Created on ${dayjs(project.createdAt).format("MMMM D, YYYY")}`}
            titleAction={<SmartBackButton projectId={projectId} />}
            tabsProps={{
                tabs: [
                    {
                        title: "Prompts",
                    },
                    {
                        title: "Experiments",
                        slug: `/experiments`,
                        aliases: [`/experiments/create`, { type: "regex", value: /experiments\/(.*)$/.source }],
                        prefetch: false,
                    },
                ],
                path: `projects/${projectId}`,
            }}
            action={
                <div className='flex space-x-4'>
                    <ProjectEditDropdown projectId={projectId} projectName={project.name} />
                    <ContainerAction projectId={projectId} />
                </div>
            }
        >
            {children}
        </DetailedContainer>
    )
}
