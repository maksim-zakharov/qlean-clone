import {Card} from "../../../components/ui/card.tsx";
import {Typography} from "../../../components/ui/Typography.tsx";
import dayjs from "dayjs";
import React from "react";
import {ErrorState} from "../../../components/ErrorState.tsx";
import {EmptyState} from "../../../components/EmptyState.tsx";
import {ClipboardPlus} from "lucide-react";
import {Button} from "../../../components/ui/button.tsx";
import {RoutePaths} from "../../../routes.ts";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

export const AdminUsersTab = ({users, isError}) => {
    const navigate = useNavigate()
    const {t} = useTranslation();

    const handleOrderClick = (order: any) => navigate(RoutePaths.Admin.Users.Details(order.id))

    if (isError) {
        return <ErrorState/>
    }

    if (users.length === 0) {
        return <EmptyState
            icon={<ClipboardPlus className="h-10 w-10"/>}
            title={t('client_orders_empty_title')}
            description={t('client_orders_empty_description')}
            action={
                <Button onClick={() => navigate(RoutePaths.Root)}
                >
                    {t('client_orders_empty_btn')}
                </Button>}
        />
    }

    return <div className="p-4 flex flex-col gap-4">
        {users.length > 0 && <div className="flex flex-col gap-4">
            {users.map((ao: any) => <Card className="p-0 pl-4 gap-0 border-none card-bg-color"
                                          onClick={() => handleOrderClick(ao)}>
                <div className={`p-3 pl-0 ${ao.phone && 'separator-shadow-bottom'}`}>
                    <div className="flex justify-between">
                        <Typography.Title>{ao.firstName} {ao.lastName}</Typography.Title>
                        {ao.username && <a href={`https://t.me/${ao.username}`}
                                           target="_blank"><Typography.Title>@{ao.username}</Typography.Title></a>}
                    </div>
                    <div className="flex justify-between">
                        <Typography.Description>id: {ao.id}</Typography.Description>
                        <Typography.Description>{dayjs.utc(ao.createdAt).local().format('D MMMM, HH:mm')}</Typography.Description>
                    </div>
                </div>
                {ao.phone && <div className="p-3 pl-0 flex gap-2 flex-col">
                    <div className="flex justify-between">
                        <Typography.Title>{ao.phone}</Typography.Title>
                    </div>
                </div>}
            </Card>)}
        </div>}
    </div>
}