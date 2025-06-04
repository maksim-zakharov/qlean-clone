import React from "react";
import {Typography} from "../../components/ui/Typography.tsx";
import {Button} from "../../components/ui/button.tsx";
import {useGetAdminOrdersQuery} from "../../api/ordersApi.ts";
import {useTranslation} from "react-i18next";
import {ErrorState} from "../../components/ErrorState.tsx";
import {Header} from "../../components/ui/Header.tsx";
import {AdminOrdersList} from "../../components/AdminOrdersList.tsx";


export const AdminOrdersPage = () => {
    const {t} = useTranslation();
    const {data: orders = [], isLoading, isError} = useGetAdminOrdersQuery(undefined, {
        refetchOnMountOrArgChange: true
    });

    if (isError) {
        return <ErrorState/>
    }

    return <>
        <Header className="flex justify-center">
            <Button variant="ghost"
                    className="flex flex-col items-center h-auto text-tg-theme-text-color text-base font-medium">
                <Typography.Title>{t('menu_item_orders')}</Typography.Title>
            </Button>
        </Header>
        <AdminOrdersList isLoading={isLoading} orders={orders}/>
    </>
}