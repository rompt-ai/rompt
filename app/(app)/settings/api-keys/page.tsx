import { getServiceKeys } from "@/lib/requests/getServiceKeys"

import { ServiceKeyForm } from "./components/ServiceKeyForm"

export const dynamic = "force-dynamic"

export default async function Page() {
    const serviceKeys = await getServiceKeys()

    return (
        <ServiceKeyForm
            userKeys={{
                openai: serviceKeys.find((key) => key.service === "openai")?.key,
            }}
        />
    )
}
