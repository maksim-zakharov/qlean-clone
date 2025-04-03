import {useSelector} from "react-redux";
import {Header} from "../components/ui/Header.tsx";
import {BackButton} from "../components/BackButton.tsx";
import {Typography} from "../components/ui/Typography.tsx";
import React from "react";
import {Pencil, User} from "lucide-react";
import {Card} from "../components/ui/card.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "../components/ui/avatar.tsx";
import {Button} from "../components/ui/button.tsx";
import {usePatchPhoneMutation} from "../api.ts";

export const ProfilePage = () => {

    const userInfo = useSelector(state => state.createOrder.userInfo);
    const [patchPhone] = usePatchPhoneMutation();

    const handleRequestContact = () => {
        Telegram.WebApp?.requestContact(async (isRequested) => {
            if (!isRequested) {
                return;
            }
            // Отправляем данные на сервер
            // @ts-ignore
            await patchPhone({phone: Telegram.WebApp.initDataUnsafe?.user?.phone_number}).unwrap();
        });
    }

    return <div className="fixed inset-0 flex flex-col">
        <Header>
            <div className="grid grid-cols-[40px_auto_40px]">
                <BackButton url="/"/>
            </div>
        </Header>
        <div className="flex-1 overflow-y-auto overscroll-none bg-tg-theme-secondary-bg-color px-4 mt-[56px]">
            <Card className="p-0 gap-0 mt-2">
                <div className="p-4 separator-shadow-bottom flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                        <Avatar>
                            <AvatarImage src={userInfo?.photoUrl}/>
                            <AvatarFallback><User/></AvatarFallback>
                        </Avatar>
                        <Typography.Title
                            className="text-xl">{userInfo?.firstName} {userInfo?.lastName}</Typography.Title>
                    </div>
                    <Button variant="ghost" className="pr-1 text-tg-theme-hint-color h-6">
                        <Pencil/>
                    </Button>
                </div>
                <div className="p-4 separator-shadow-bottom flex justify-between items-center">
                    <div className="flex flex-col">
                        <Typography.Description>Телефон</Typography.Description>
                        <Typography.Title>{userInfo?.phone || 'Отсутствует'}</Typography.Title>
                    </div>
                    {!userInfo?.phone && <Button size="sm" variant="default" onClick={handleRequestContact}>
                        Обновить
                    </Button>}
                </div>
            </Card>
        </div>
    </div>
}