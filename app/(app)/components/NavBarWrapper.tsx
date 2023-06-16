import { getUser } from "@/lib/requests/getUser"
import { NavBar } from "@/components/NavBar"

export async function NavBarWrapper() {
    const user = await getUser()
    return <NavBar email={user.email || ""} />
}
