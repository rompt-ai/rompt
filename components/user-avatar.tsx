import { User } from "@prisma/client"
import { AvatarProps } from "@radix-ui/react-avatar"
import { User as UserIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserAvatarProps extends AvatarProps {
    user: Pick<User, "image" | "name">
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
    return (
        <Avatar {...props}>
            {user.image ? (
                <AvatarImage alt='Picture' src={user.image} />
            ) : (
                <AvatarFallback>
                    <span className='sr-only'>{user.name}</span>
                    <UserIcon className='h-4 w-4' />
                </AvatarFallback>
            )}
        </Avatar>
    )
}
