import { NextResponse } from "next/server"

export const GET = (req, { params: { projectId, promptId } }) => {
    return new NextResponse(null, {
        headers: {
            Location: `/projects/${projectId}/${promptId}/latest`,
        },
        status: 302,
    })
}
