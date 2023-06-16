import Link from "next/link"

import { prisma } from "@/lib/prisma"
import BackButton from "@/components/BackButton"

import Container from "../../components/Container"
import { CreatePromptForm } from "./components/CreatePromptForm"

export default async function CreatePage({ params: { projectId } }) {
    const projects = await prisma.project.findMany({
        select: {
            name: true,
            id: true,
        },
    })

    return (
        <Container
            title='Create new prompt'
            titleAction={
                <Link href={`/${projectId}`}>
                    <BackButton />
                </Link>
            }
            className='mt-8 max-w-3xl'
        >
            <CreatePromptForm projectId={projectId} projects={projects} />
        </Container>
    )
}
