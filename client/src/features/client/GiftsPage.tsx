import {Header} from "../../components/ui/Header.tsx";
import {Typography} from "../../components/ui/Typography.tsx";
import React from "react";
import {useTranslation} from "react-i18next";
import {Button} from "../../components/ui/button.tsx";
import { Tabs } from "@/components/ui/tabs.tsx";
import {TabsList, TabsTrigger} from "../../components/ui/tabs.tsx";
import {EmptyState} from "../../components/EmptyState.tsx";
import {GiftIcon} from "lucide-react";

export const GiftsPage = () => {
    const {t} = useTranslation();

    const tabs = [
        {
            id: 'active',
            label:'Активные'
        },
        {
            id: 'completed',
            label:'Завершенные'
        }
    ]

    const [selectedTab, setSelectedTab] = React.useState<string>(tabs[0].id);

    const handleShareButtonClick = () => {
        const inviteLink = `https://t.me/your_bot?start=ref_${123}`;
        const text = `Присоединяйтесь! ${inviteLink}`;

        // Формируем ссылку для шаринга
        const shareUrl = `tg://share?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(text)}`;

        // Открываем шторку через Telegram
        Telegram.WebApp.openLink(shareUrl);
    }

    return <>
        <Header>
            <Typography.Title
                className="items-center flex justify-center">{t('menu_item_gifts')}</Typography.Title>
        </Header>
        <img src="../img_1.png" className="h-[240px] object-cover mb-4"/>
        <div className="content px-4 w-full">
            <div className="flex flex-col gap-4">
                <Typography.H2 className="text-3xl m-0 text-center">Рекомендуйте QLean <br/> и получайте
                    бонусы</Typography.H2>

                <Typography.Title className="text-center">{t('create_application_question')}</Typography.Title>
                <Button
                    wide
                    size="lg"
                    onClick={handleShareButtonClick}
                >
                    Рекомендовать
                </Button>

                <Typography.H2 className="pt-4">
                    Вы пригласили
                </Typography.H2>
            </div>
        </div>
        <Tabs value={selectedTab} defaultValue={selectedTab} on>
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
        <EmptyState icon={<GiftIcon/>} title="Здесь сейчас пусто" description="Наверняка кто-нибудь из друзей ждет, когда вы пригласите их в QLean"/>
    </>
}