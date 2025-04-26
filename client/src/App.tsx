import {Navigate, Route, Routes, useNavigate, useSearchParams} from "react-router-dom"
import {ClientLayout} from "./components/layout/ClientLayout.tsx"
import MainPage from "./features/client/MainPage.tsx"
import {OrderCreationPage} from "./features/client/OrderCreationPage.tsx"
import {OrderCheckoutPage} from "./features/client/OrderCheckoutPage.tsx"
import {ClientOrdersPage} from "./features/client/ClientOrdersPage.tsx";
import {useGetServicesQuery, useGetUserInfoQuery} from "./api.ts";
import {OrderDetailsPage} from "./features/client/OrderDetailsPage.tsx";
import {ProfilePage} from "./features/client/ProfilePage.tsx";
import {RoutePaths} from "./routes.ts";
import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {startOrderFlow} from "./slices/createOrderSlice.ts";
import {useTelegram} from "./hooks/useTelegram.ts";
import {ExecutorLayout} from "./components/layout/ExecutorLayout.tsx";
import {ExecutorOrdersPage} from "./features/executor/ExecutorOrdersPage.tsx";
import {ExecutorPaymentsPage} from "./features/executor/ExecutorPaymentsPage.tsx";
import {ExecutorSchedulePage} from "./features/executor/ExecutorSchedulePage.tsx";

function App() {
    const {isReady} = useTelegram();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const startParam = Telegram.WebApp.initDataUnsafe.start_param || searchParams.get('tgWebAppStartParam') || searchParams.get('startapp') || '';

    const [serviceId, variantId ] = startParam.split('_').filter((_, i) => i % 2 !== 0);

    const {data: userinfo} = useGetUserInfoQuery(undefined, {
        skip: !isReady
    });
    const {data: services = []} = useGetServicesQuery();

    useEffect(() => {
        if (serviceId && services?.length > 0) {
            // Загрузка данных
            const baseService = services.find((service) => service.id?.toString() === serviceId);
            if (!baseService)
                return;

            const serviceVariant = baseService?.variants?.find((variant) => variant.id.toString() === variantId) || baseService?.variants[0];

            dispatch(startOrderFlow({baseService, serviceVariant}))
            navigate(RoutePaths.Order.Create);
        }
    }, [serviceId, variantId, services]);

    if(!userinfo) {
        return 'Loading'
    }

    if(userinfo.role === 'admin'){
        return 'admin'
    }

    if(userinfo.role === 'executor') {
        return <div className="content-wrapper">
            <Routes>
                <Route element={<ExecutorLayout/>}>
                    <Route path={RoutePaths.Executor.Orders} element={<ExecutorOrdersPage/>}/>
                    <Route path={RoutePaths.Executor.Payments} element={<ExecutorPaymentsPage/>}/>
                    <Route path={RoutePaths.Executor.Schedule} element={<ExecutorSchedulePage/>}/>
                    <Route path={RoutePaths.Executor.Profile} element={<div className="p-4">Бонусы</div>}/>
                    <Route path="*" element={<Navigate to={RoutePaths.Executor.Orders}/>}/>
                </Route>
            </Routes>
        </div>
    }


    return (
        <div className="content-wrapper">
            <Routes>
                <Route element={<ClientLayout/>}>
                    <Route path={RoutePaths.Root} element={<MainPage/>}/>
                    <Route path={RoutePaths.Orders} element={<ClientOrdersPage/>}/>
                    <Route path={RoutePaths.Bonuses} element={<div className="p-4">Бонусы</div>}/>
                </Route>
                <Route path={RoutePaths.Order.Create} element={<OrderCreationPage/>}/>
                <Route path={RoutePaths.Order.Checkout} element={<OrderCheckoutPage/>}/>
                <Route path={RoutePaths.Order.Details(':id')} element={<OrderDetailsPage/>}/>
                <Route path={RoutePaths.Profile} element={<ProfilePage/>}/>
                <Route path="*" element={<Navigate to={RoutePaths.Root}/>}/>
            </Routes>
        </div>
    )
}

export default App
