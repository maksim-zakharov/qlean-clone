import {Header} from "../../components/ui/Header.tsx";
import {Typography} from "../../components/ui/Typography.tsx";
import React from "react";
import {useTranslation} from "react-i18next";
import {Button} from "../../components/ui/button.tsx";
import {Tabs} from "@/components/ui/tabs.tsx";
import {TabsList, TabsTrigger} from "../../components/ui/tabs.tsx";
import {EmptyState} from "../../components/EmptyState.tsx";
import { GiftIcon, QrCode} from "lucide-react";
import {Card} from "../../components/ui/card.tsx";
import dayjs from "dayjs";
import {useSelector} from "react-redux";
import {useGetInvitesQuery} from "../../api/api.ts";
import {Skeleton} from "../../components/ui/skeleton.tsx";
import {QRCodeSheet} from "../../components/QRCodeSheet.tsx";

export const GiftsPage = () => {
    const {t} = useTranslation();
    const userInfo = useSelector(state => state.createOrder.userInfo);
    const {data: invites, isLoading, isSuccess} = useGetInvitesQuery();

    const tabs = [
        {
            id: 'active',
            label: t('bonuses_tabs_active')
        },
        {
            id: 'completed',
            label: t('bonuses_tabs_completed')
        }
    ]

    const [selectedTab, setSelectedTab] = React.useState<string>(tabs[0].id);
    const inviteLink = `https://t.me/qlean_clone_bot?startapp=ref_${userInfo.id}`;

    const handleShareButtonClick = async () => {
        const text = t('bonuses_title');

        try {
            await navigator.share({
                title: text,
                text: text,
                url: inviteLink, // Опционально
            });
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    const promocodes = [{
        name: 'XFADF123',
        expiratedDate: dayjs().format('dd, D MMMM')
    }, {
        name: 'XFADF123',
        expiratedDate: dayjs().format('dd, D MMMM')
    }];

    return <>
        <Header className="grid grid-cols-3">
            <div>
                <QRCodeSheet onClick={handleShareButtonClick} url={inviteLink}>
                    <Button className="p-0 border-none h-100%" variant="default" size="sm">
                        <QrCode className="w-6 h-6 mr-2"/>
                    </Button>
                </QRCodeSheet>
            </div>
            <Typography.Title
                className="items-center flex justify-center">{t('menu_item_gifts')}</Typography.Title>
        </Header>
        <img src="../img_1.png" className="h-[240px] object-cover mb-4"/>
        <div className="content px-4 w-full">
            <div className="flex flex-col gap-4">
                <Typography.H2 className="text-3xl m-0 text-center">{t('bonuses_title')}</Typography.H2>

                <Typography.Title className="text-center">{t('bonuses_description')}</Typography.Title>
                <Button
                    wide
                    size="lg"
                    onClick={handleShareButtonClick}
                >
                    {t('bonuses_recommended_btn')}
                </Button>
            </div>
        </div>

        <Typography.H2 className="p-4 pb-0 mt-4">
            {t('bonuses_promocodes_title')}
        </Typography.H2>
        <div className="flex flex-col gap-2">
            {promocodes.map(ao => <Card className="p-0 mx-3 pl-4 gap-0 border-none card-bg-color">
                <div className="p-3 pl-0 flex justify-between">
                    <Typography.Title>{ao.name}</Typography.Title>
                    <Typography.Title>{ao.expiratedDate}</Typography.Title>
                </div>
            </Card>)}
        </div>

        <Typography.H2 className="p-4 pb-0">
            {t('bonuses_invites_title')}
        </Typography.H2>
        <Tabs value={selectedTab} defaultValue={selectedTab}>
            <TabsList className="bg-inherit flex justify-around">
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
        {!invites?.length && isSuccess && <EmptyState icon={<GiftIcon/>} title={t('bonuses_invites_empty_title')}
                                                      description={t("bonuses_invites_empty_description")}/>}
        {isLoading && <Skeleton className="w-full h-[200px] rounded-none"/>}
        {invites?.length && <div className="flex flex-col gap-2 pb-3">
            {invites.map(ao => <Card className="p-0 mx-3 pl-4 gap-0 border-none card-bg-color mt-2">
                <div className="p-3 pl-0 flex justify-between">
                    <Typography.Title>{ao.firstName} {ao.lastName}</Typography.Title>
                    <Typography.Title>{dayjs(ao.createdAt).format('dd, D MMMM')}</Typography.Title>
                </div>
            </Card>)}
        </div>}
    </>
}