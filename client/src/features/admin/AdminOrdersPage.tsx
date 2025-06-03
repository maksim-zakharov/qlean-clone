import React from "react";
import {Typography} from "../../components/ui/Typography.tsx";
import {Card} from "../../components/ui/card.tsx";
import {Button} from "../../components/ui/button.tsx";
import {useGetAdminOrdersQuery} from "../../api/ordersApi.ts";
import dayjs from "dayjs";
import {ClipboardPlus} from "lucide-react";
import {moneyFormat} from "../../lib/utils.ts";
import {useNavigate} from "react-router-dom";
import {Skeleton} from "../../components/ui/skeleton.tsx";
import {EmptyState} from "../../components/EmptyState.tsx";
import {RoutePaths} from "../../routes.ts";
import {useTranslation} from "react-i18next";
import {ErrorState} from "../../components/ErrorState.tsx";
import {OrderStatusText} from "../../components/OrderStatusText.tsx";
import {Header} from "../../components/ui/Header.tsx";


export const AdminOrdersPage = () => {
    const {t} = useTranslation();
    const navigate = useNavigate()
    const {data: orders = [], isLoading, isError} = useGetAdminOrdersQuery(undefined, {
        refetchOnMountOrArgChange: true
    });

    const handleOrderClick = (order: any) => navigate(RoutePaths.Admin.Order.Details(order.id))


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

    if (orders.length === 0) {
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
                <Typography.Title>{t('menu_item_orders')}</Typography.Title>
            </Button>
        </Header>
        <div className="p-4 flex flex-col gap-4">
            {orders.length > 0 && <div className="flex flex-col gap-4">
                {orders.map((ao: any) => <Card className="p-0 pl-4 gap-0 border-none card-bg-color"
                                                     onClick={() => handleOrderClick(ao)}>
                    <div className="p-3 pl-0 separator-shadow-bottom">
                        <div className="flex justify-between">
                            <Typography.Title>{ao.baseService?.name}</Typography.Title>
                            <Typography.Title>{moneyFormat(ao.serviceVariant?.basePrice + ao.options.reduce((acc, curr) => acc + curr?.price, 0))}</Typography.Title>
                        </div>
                        <div className="flex justify-between">
                            <Typography.Description>{ao.fullAddress}</Typography.Description>
                            <Typography.Description>{dayjs.utc(ao.date).local().format('D MMMM, HH:mm')}</Typography.Description>
                        </div>
                    </div>
                    <div className="p-3 pl-0 flex gap-2 flex-col">
                        <div className="flex justify-between">
                            <Typography.Title>№{ao.id}</Typography.Title>
                            <Typography.Title><OrderStatusText status={ao.status}/></Typography.Title>
                        </div>
                        <div className="flex justify-between align-bottom items-center">
                            <Typography.Description>Executor: {ao.executor ? `${ao.executor?.firstName} ${ao.executor?.lastName}` : '-'}</Typography.Description>
                            {ao.startedAt && <Typography.Description>{dayjs.utc(ao.startedAt).local().format('D MMMM, HH:mm')}</Typography.Description>}
                        </div>
                    </div>
                </Card>)}
            </div>}
        </div>
    </>
}