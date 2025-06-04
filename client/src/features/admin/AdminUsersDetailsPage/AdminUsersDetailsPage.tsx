import {Header} from "../../../components/ui/Header.tsx";
import {Typography} from "../../../components/ui/Typography.tsx";
import React, {FC, useMemo, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {
    useCancelOrderMutation,
    useGetAdminApplicationByUserIdQuery, useGetAdminInvitesByUserIdQuery,
    useGetAdminOrdersByUserIdQuery,
    useGetAdminUserByIdQuery,
    usePatchOrderMutation
} from "../../../api/ordersApi.ts";
import dayjs from "dayjs";
import {Card} from "../../../components/ui/card.tsx";
import {User} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "../../../components/ui/avatar.tsx";
import {Skeleton} from "../../../components/ui/skeleton.tsx";
import {RoutePaths} from "../../../routes.ts";
import {EditButton} from "../../../components/EditButton.tsx";
import {useTranslation} from "react-i18next";
import {ErrorState} from "../../../components/ErrorState.tsx";
import {useBackButton} from "../../../hooks/useTelegram.tsx";
import {Tabs, TabsList, TabsTrigger} from "../../../components/ui/tabs.tsx";
import {AdminOrdersList} from "../../../components/AdminOrdersList.tsx";
import {numberFormat} from "../../../lib/utils.ts";
import {AdminApplicationTab} from "./AdminApplicationTab.tsx";
import {InvitesList} from "../../../components/InvitesList.tsx";

export const AdminUsersDetailsPage: FC = () => {
    useBackButton(() => navigate(RoutePaths.Admin.Users.List));

    const {t} = useTranslation();
    const [patchOrder] = usePatchOrderMutation();
    const [cancelOrder, {isLoading: cancelLoading}] = useCancelOrderMutation();
    const navigate = useNavigate()

    const {id} = useParams<string>();
    const {data: application} = useGetAdminApplicationByUserIdQuery({id: id!});
    const {data: invites = [], isSuccess: isSuccessInvites, isLoading: isLoadingInvites} = useGetAdminInvitesByUserIdQuery({id: id!});

    const tabs = useMemo(() => {
        const _tabs = [
            {
                id: 'orders',
                label: t('menu_item_orders')
            },
            {
                id: 'invites',
                label: 'Invites'
            },
        ];

        if (application) {
            _tabs.unshift(
                {
                    id: 'application',
                    label: t('user_application_title')
                });
        }

        return _tabs;
    }, [application]);

    const [selectedTab, setSelectedTab] = React.useState<string>(tabs[0].id);

    const {data: user, isLoading, isError} = useGetAdminUserByIdQuery({id: id!});
    const {data: orders, isLoading: isLoadingOrders} = useGetAdminOrdersByUserIdQuery({id: id!})
    const [{title, description, show}, setAlertConfig] = useState({
        title: '',
        description: '',
        show: false
    })

    const handleChangeComment = async (comment?: string) => {
        if (comment && comment !== user.comment)
            await patchOrder({id: user.id, comment}).unwrap();
    }

    const handleOkClick = () => {
        setAlertConfig(prevState => ({...prevState, show: false}));
        setTimeout(() => setAlertConfig(prevState => ({...prevState, title: '', description: ''})), 300);
    }

    const handleCancelClick = async () => {
        await cancelOrder({id: user.id}).unwrap();
        setAlertConfig(prevState => ({...prevState, show: false}));
        setTimeout(() => setAlertConfig(prevState => ({...prevState, title: '', description: ''})), 300);
    }

    if (isLoading || cancelLoading || !user) {
        return <div className="p-4 mt-[56px] flex flex-col gap-4">
            <Skeleton className="w-full h-[112px]"/>
            <Skeleton className="w-full h-[192px]"/>
            <Skeleton className="w-full h-[164px]"/>
        </div>
    }

    if (isError) {
        return <div
            className="h-screen">
            <ErrorState/>
        </div>
    }

    return <div className="flex flex-col bg-inherit overflow-y-auto overscroll-none h-screen pb-4">
        <Header>
            <Typography.Title
                className="items-center flex justify-center">Пользователь</Typography.Title>
        </Header>
        <div className="flex flex-col gap-2 bg-inherit p-4 pb-2">
            <Avatar className="rounded-full bg-tg-theme-secondary-bg-color m-auto mb-2 size-30">
                <AvatarImage src={user?.photoUrl}/>
                <AvatarFallback className="bg-tg-theme-secondary-bg-color"><User/></AvatarFallback>
            </Avatar>

            <Card className="p-0 pl-4 gap-0">
                <div className="p-3 pl-0">
                    <div className="flex justify-between">
                        <Typography.Title>
                            {user.firstName} {user.lastName}
                        </Typography.Title>
                        <Typography.Title>{dayjs.utc(user.createdAt).local().format('YYYY-MM-DD')}</Typography.Title>
                    </div>
                    <div className="flex justify-between">
                        <Typography.Description>@{user.username}</Typography.Description>
                        <Typography.Description>id: {user.id}</Typography.Description>
                    </div>
                </div>
            </Card>

            <Card className="p-0 pl-4 gap-0">
                <div className="p-3 pl-0">
                    <div className="flex justify-between">
                        <Typography.Title>Bonuses</Typography.Title>
                        <Typography.Title>
                            {numberFormat(123123)} <EditButton/>
                        </Typography.Title>
                    </div>
                </div>
            </Card>
        </div>

        <Tabs value={selectedTab} defaultValue={selectedTab}>
            <TabsList className="bg-inherit flex pl-8">
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
        {selectedTab === 'orders' && <AdminOrdersList orders={orders} isLoading={isLoadingOrders}/>}

        {selectedTab === 'application' && <AdminApplicationTab application={application}/>}
        {selectedTab === 'invites' && <InvitesList invites={invites} isSuccess={isSuccessInvites} isLoading={isLoadingInvites}/>}
    </div>
}