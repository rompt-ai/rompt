import { ReportingType } from "@prisma/client"

import { prisma } from "@/lib/prisma"

import { ResultsTable } from "./components/ResultsTable"
import { ZippedExperimentPrompts } from "./components/types"

export const dynamic = "force-dynamic"

export default async function Page({
    params,
}: {
    params: { projectId: string; experimentId: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const {
        experiments: [{ experimentPrompts: experimentPromptRatingsArr, reportingType }],
    } = await prisma.project.findFirstOrThrow({
        where: {
            id: params.projectId,
        },
        select: {
            experiments: {
                where: {
                    id: params.experimentId,
                },
                include: {
                    experimentPrompts: {
                        include: {
                            experimentPromptRatings: true,
                            prompt: true,
                        },
                    },
                },
            },
        },
    })

    const promptToRatings: ZippedExperimentPrompts = {}
    experimentPromptRatingsArr.forEach((rating) => {
        const key: `${string}-${number}` = `${rating.promptId}-${rating.promptVersion}`
        if (!promptToRatings[key]) {
            promptToRatings[key] = {
                prompt: rating.prompt,
                ratings: [],
            }
        }
        promptToRatings[key].ratings.push(...rating.experimentPromptRatings)
    })

    const promptsArr: (ZippedExperimentPrompts[keyof ZippedExperimentPrompts] & { average: number; key: string })[] = []
    Object.entries(promptToRatings).forEach(([key, { prompt, ratings }]) => {
        const average =
            reportingType === ReportingType.approval
                ? ratings.reduce((acc, curr) => acc + curr.score, 0) / ratings.length
                : ratings.reduce((acc, curr) => acc + curr.score, 0) / ratings.length / 10

        promptsArr.push({
            prompt: prompt,
            ratings,
            average,
            key,
        })
    })

    // Sort by average
    promptsArr.sort(({ average: a }, { average: b }) => b - a)

    return (
        <div className='mt-10 overflow-hidden rounded-md border-[0.5px] border-border'>
            <table className='w-full min-w-full table-fixed divide-y divide-border'>
                <colgroup>
                    <col className='w-[250px]' />
                    <col className='w-[calc(100%-250px-100px)]' />
                    <col className='w-[100px]' />
                </colgroup>
                <thead className='!border-t-transparent bg-muted/30'>
                    <tr>
                        <th scope='col' className='px-6 py-3 text-left text-sm font-medium uppercase leading-none'>
                            Source
                        </th>
                        <th scope='col' className='px-6 py-3 text-center text-sm font-medium uppercase leading-none'>
                            Rating
                        </th>
                        <th scope='col' />
                    </tr>
                </thead>
                <tbody className='bg-slate divide-y divide-border'>
                    <ResultsTable promptsArr={promptsArr} />
                </tbody>
            </table>
        </div>
    )
}
