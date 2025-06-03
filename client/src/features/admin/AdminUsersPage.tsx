import React from "react";
import {Typography} from "../../components/ui/Typography.tsx";
import {Card} from "../../components/ui/card.tsx";
import {Button} from "../../components/ui/button.tsx";
import { useGetAdminUsersQuery} from "../../api/ordersApi.ts";
import dayjs from "dayjs";
import {ClipboardPlus} from "lucide-react";
import {useDispatch} from "react-redux";
import { selectBaseService} from "../../slices/createOrderSlice.ts";
import {useNavigate} from "react-router-dom";
import {Skeleton} from "../../components/ui/skeleton.tsx";
import {EmptyState} from "../../components/EmptyState.tsx";
import {RoutePaths} from "../../routes.ts";
import {useTranslation} from "react-i18next";
import {ErrorState} from "../../components/ErrorState.tsx";
import {Header} from "../../components/ui/Header.tsx";


export const AdminUsersPage = () => {
    const {t} = useTranslation();
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const {data: users = [], isLoading, isError} = useGetAdminUsersQuery(undefined, {
        refetchOnMountOrArgChange: true
    });

    const handleAddOptionClick = (e: React.MouseEvent<HTMLButtonElement>, order: any) => {
        e.stopPropagation()
        dispatch(selectBaseService(order))
        navigate('/order')
    }

    const handleOrderClick = (order: any) => navigate(`/order/${order.id}`)

    if (isLoading) {
        return <div className="px-4 mb-4">
            <Header className="flex justify-center">
                <Skeleton className="w-[100px] h-[28px]"/>
            </Header>
            <div className="flex flex-col gap-4 mt-4">
                <Skeleton className="w-full h-[144px]"/>
                <Skeleton className="w-full h-[144px]"/>
                <Skeleton className="w-full h-[144px]"/>
                <Skeleton className="w-full h-[144px]"/>
            </div>
        </div>
    }

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

    return <>
        <Header className="flex justify-center">
            <Button variant="ghost"
                    className="flex flex-col items-center h-auto text-tg-theme-text-color text-base font-medium">
                <Typography.Title>{t('menu_item_users')}</Typography.Title>
            </Button>
        </Header>
        <div className="p-4 flex flex-col gap-4">
            {users.length > 0 && <div className="flex flex-col gap-4">
                {users.map((ao: any) => <Card className="p-0 pl-4 gap-0 border-none card-bg-color"
                                                     onClick={() => handleOrderClick(ao)}>
                    <div className={`p-3 pl-0 ${ao.phone && 'separator-shadow-bottom'}`}>
                        <div className="flex justify-between">
                            <Typography.Title>{ao.firstName} {ao.lastName}</Typography.Title>
                            {ao.username && <a href={`https://t.me/${ao.username}`} target="_blank"><Typography.Title>@{ao.username}</Typography.Title></a>}
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
    </>
}