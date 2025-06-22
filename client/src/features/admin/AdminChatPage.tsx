import React from "react";
import {List} from "../../components/ui/list.tsx";
import {User} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "../../components/ui/avatar.tsx";
import dayjs from "dayjs";
import {useGetAdminChatsQuery} from "../../api/ordersApi.ts";
import {RoutePaths} from "../../routes.ts";
import {useNavigate} from "react-router-dom";

export const AdminChatPage = () => {
    const navigate = useNavigate()

    const {data: dialogs = []} = useGetAdminChatsQuery();

    return <>
        <List itemClassName="flex gap-2 p-2" className="rounded-none">
            {dialogs.map((option) => <div className="flex gap-3 w-full" onClick={() => navigate(RoutePaths.Admin.Chat.Details(option.id))}>
                <Avatar className="size-[28px] h-[54px] w-[54px]">
                    <AvatarImage/>
                    <AvatarFallback><User/></AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2 w-full">
                    <div className="flex items-center gap-3 w-full justify-between">
                    <span
                        className="text-[16px] [line-height:20px] [font-weight:500] text-tg-theme-text-color truncate">
                        {option.name}
                    </span>
                        <span
                            className="text-[12px] [line-height:20px] [font-weight:400] text-tg-theme-subtitle-text-color truncate">
                            {dayjs.utc(option.date).local().format('HH:mm')}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 w-full justify-between">
                    <span
                        className="text-[16px] [line-height:20px] [font-weight:400] text-tg-theme-subtitle-text-color truncate">
                        {option.lastMessage}
                    </span>
                    </div>
                </div>
            </div>)}
        </List>
    </>
}