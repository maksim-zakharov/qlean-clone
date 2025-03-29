import React from "react";
import {Tabs, TabsList, TabsTrigger} from "../components/ui/tabs.tsx";


export const OrdersPage = () => {

    return <>
        <Tabs defaultValue="active" className="mt-[calc(env(safe-area-inset-top))]">
            <TabsList className="justify-around">
                <TabsTrigger
                    key="active"
                    value="active"
                >
                    Активные
                </TabsTrigger>
                <TabsTrigger
                    key="completed"
                    value="completed"
                >
                    Завершенные
                </TabsTrigger>
            </TabsList>
        </Tabs>
    </>
}