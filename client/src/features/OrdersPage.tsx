import React from "react";
import {Typography} from "../components/ui/Typography.tsx";
import {Card} from "../components/ui/card.tsx";
import {Button} from "../components/ui/button.tsx";


export const OrdersPage = () => {

    return <div className="px-4">
        <div className="mb-6">
            <Typography.H2>
                Активные
            </Typography.H2>
            <Card className="p-0 gap-0">
                <div className="p-4 separator-shadow-bottom">
                    <div className="flex justify-between">
                        <Typography.Title>Доставка</Typography.Title>
                        <Typography.Title>1246Р</Typography.Title>
                    </div>
                    <div className="flex justify-between">
                        <Typography.Description>Москва, Ходынский бульвар, 2</Typography.Description>
                        <Typography.Description>30 марта</Typography.Description>
                    </div>
                </div>
                <div className="p-4 flex gap-2 flex-col">
                    <div className="flex justify-between">
                        <Typography.Title>№12313123</Typography.Title>
                        <Typography.Title>Оформлен</Typography.Title>
                    </div>
                    <div className="flex justify-between align-bottom items-baseline">
                        <Button variant="default" size="small">Добавить услугу</Button>
                        <Typography.Description>Поддержка</Typography.Description>
                    </div>
                </div>
            </Card>
        </div>
        <Typography.H2>
            Все заявки
        </Typography.H2>
        <Card className="p-0 gap-0">
            <div className="p-4 separator-shadow-bottom">
                <div className="flex justify-between">
                    <Typography.Title>Доставка</Typography.Title>
                    <Typography.Title>1246Р</Typography.Title>
                </div>
                <div className="flex justify-between">
                    <Typography.Description>Москва, Ходынский бульвар, 2</Typography.Description>
                    <Typography.Description>30 марта</Typography.Description>
                </div>
            </div>
            <div className="p-4 flex gap-2 flex-col">
                <div className="flex justify-between">
                    <Typography.Title>№12313123</Typography.Title>
                    <Typography.Title>Завершен</Typography.Title>
                </div>
                <div className="flex justify-between align-bottom items-baseline">
                    <Button variant="default" size="small">Повторить</Button>
                    <Typography.Description>Поддержка</Typography.Description>
                </div>
            </div>
        </Card>
    </div>
}