import {Avatar, AvatarFallback, AvatarImage} from "./ui/avatar.tsx";
import {User} from "lucide-react";
import {Typography} from "./ui/Typography.tsx";
import React from "react";

export const ProfileSection = ({user}) => {

    return <Typography.H2 className="flex flex-col gap-2 pt-4 text-center text-3xl font-medium mb-4">
        <Avatar className="size-24 m-auto">
            <AvatarImage src={user?.photoUrl}/>
            <AvatarFallback><User/></AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
            <div>
                {user?.firstName} {user?.lastName}
            </div>
            <Typography.Description className="text-lg font-normal">id: {user?.id} • @{user?.username}</Typography.Description>
        </div>
    </Typography.H2>
}