import { NextResponse } from "next/server"
import { ServiceKeyType } from "@prisma/client"
import { z } from "zod"

import { withAuthentication } from "@/lib/api-middlewares/with-authentication"
import { prisma } from "@/lib/prisma"

const schema = z.object({
    service: z.nativeEnum(ServiceKeyType),
})

export type ResponseData = { success: true } | z.ZodError<z.infer<typeof schema>>

export const POST = withAuthentication(async function (req, ctx, session) {
    const parseResult = schema.safeParse(await req.json())

    if (!parseResult.success) {
        return new NextResponse(JSON.stringify(parseResult.error), {
            headers: {
                "Content-Type": "application/json",
            },
            status: 400,
        })
    }

    const { service } = parseResult.data

    await prisma.serviceKey.delete({
        where: {
            service_userId: {
                service,
                userId: session.user.id,
            },
        },
    })

    return new NextResponse(JSON.stringify({ success: true }), {
        headers: {
            "Content-Type": "application/json",
        },
        status: 200,
    })
})
