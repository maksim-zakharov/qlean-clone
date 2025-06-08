import React from "react";
import {Typography} from "../../components/ui/Typography.tsx";
import {Card} from "../../components/ui/card.tsx";
import {Button} from "../../components/ui/button.tsx";
import {useGetAdminServicesQuery, useGetAdminVariantsQuery} from "../../api/ordersApi.ts";
import {ClipboardPlus} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {Skeleton} from "../../components/ui/skeleton.tsx";
import {EmptyState} from "../../components/EmptyState.tsx";
import {RoutePaths} from "../../routes.ts";
import {useTranslation} from "react-i18next";
import {ErrorState} from "../../components/ErrorState.tsx";
import {Header} from "../../components/ui/Header.tsx";
import {DynamicIcon} from "lucide-react/dynamic";
import {Tabs, TabsList, TabsTrigger} from "../../components/ui/tabs.tsx";


export const AdminServicesPage = () => {
    const {t} = useTranslation();
    const navigate = useNavigate()
    const {data: services = []} = useGetAdminServicesQuery(undefined, {
        refetchOnMountOrArgChange: true
    });
    const {data: variants = [], isLoading, isError} = useGetAdminVariantsQuery(undefined, {
        refetchOnMountOrArgChange: true
    });

    const handleOrderClick = (order: any) => navigate(RoutePaths.Admin.Services.Details(order.id))

    const tabs = [
        {
            id: 'services',
            label: 'Services'
        },
        {
            id: 'variants',
            label: 'Variants'
        },
    ]

    const [selectedTab, setSelectedTab] = React.useState<string>(tabs[0].id);

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

    if (variants.length === 0) {
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
        <Tabs value={selectedTab} defaultValue={selectedTab}>
            <TabsList className="bg-inherit flex pl-8 justify-around">
                {tabs.map(tab => (
                    <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        onClick={() => setSelectedTab(tab.id)}
                    >
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
        {selectedTab === 'services' && <div className="p-4 flex flex-col gap-4">
            {services.length > 0 && <div className="flex flex-col gap-4">
                {services.map((ao: any) => <Card className="p-0 pl-4 gap-0 border-none card-bg-color"
                                                 onClick={() => handleOrderClick(ao)}>
                    <div className={`p-3 pl-0`}>
                        <div className="flex justify-between">
                            <Typography.Title className="flex gap-2">{ao.name}
                            </Typography.Title>
                        </div>
                        <div className="flex justify-between">
                            <Typography.Description>id: {ao.id}</Typography.Description>
                        </div>
                    </div>
                </Card>)}
            </div>}
        </div>}
        {selectedTab === 'variants' && <div className="p-4 flex flex-col gap-4">
            {variants.length > 0 && <div className="flex flex-col gap-4">
                {variants.map((ao: any) => <Card className="p-0 pl-4 gap-0 border-none card-bg-color"
                                                 onClick={() => handleOrderClick(ao)}>
                    <div className={`p-3 pl-0`}>
                        <div className="flex justify-between">
                            <Typography.Title className="flex gap-2"><DynamicIcon name={ao.icon}
                                                                                  className="w-5 h-5 text-tg-theme-button-color"
                                                                                  strokeWidth={1.5}/>{ao.name}
                            </Typography.Title>
                            <Typography.Title>{ao.baseService?.name}</Typography.Title>
                        </div>
                        <div className="flex justify-between">
                            <Typography.Description>{ao.nameAccusative}</Typography.Description>
                            <Typography.Description>id: {ao.id}</Typography.Description>
                        </div>
                    </div>
                    {ao.phone && <div className="p-3 pl-0 flex gap-2 flex-col">
                        <div className="flex justify-between">
                            <Typography.Title>{ao.phone}</Typography.Title>
                        </div>
                    </div>}
                </Card>)}
            </div>}
        </div>}
    </>
}