import {Navigate, Route, Routes, useNavigate, useSearchParams} from "react-router-dom"
import {ClientLayout} from "./components/layout/ClientLayout.tsx"
import MainPage from "./features/client/MainPage.tsx"
import {OrderCreationPage} from "./features/client/OrderCreationPage.tsx"
import {OrderCheckoutPage} from "./features/client/OrderCheckoutPage.tsx"
import {ClientOrdersPage} from "./features/client/ClientOrdersPage.tsx";
import {useGetServicesQuery, useGetUserInfoQuery} from "./api/api.ts";
import {OrderDetailsPage} from "./features/client/OrderDetailsPage.tsx";
import {ProfilePage} from "./features/client/ProfilePage.tsx";
import {RoutePaths} from "./routes.ts";
import React, {useEffect, useMemo} from "react";
import {useDispatch} from "react-redux";
import {saveInLocalStorage, startOrderFlow} from "./slices/createOrderSlice.ts";
import {useTelegram} from "./hooks/useTelegram.tsx";
import {ExecutorLayout} from "./components/layout/ExecutorLayout.tsx";
import {ExecutorOrdersPage} from "./features/executor/ExecutorOrdersPage.tsx";
import {ExecutorPaymentsPage} from "./features/executor/ExecutorPaymentsPage.tsx";
import {ExecutorSchedulePage} from "./features/executor/ExecutorSchedulePage.tsx";
import {ApplicationPage} from "./features/client/ApplicationPage.tsx";
import {ExecutorOrderDetailsPage} from "./features/executor/ExecutorOrderDetailsPage.tsx";
import './i18n';
import {Skeleton} from "./components/ui/skeleton.tsx";
import {useGeoLocation} from "./hooks/useGeoLocation.tsx";
import {AdminLayout} from "./components/layout/AdminLayout.tsx";
import {GiftsPage} from "./features/client/GiftsPage.tsx";
import {REF_HEADER} from "./api/baseQuery.ts";

function App() {
    const {isReady} = useTelegram();

    useGeoLocation({enabled: isReady});

    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const startParam = Telegram.WebApp.initDataUnsafe.start_param || searchParams.get('tgWebAppStartParam') || searchParams.get('startapp') || '';

    useEffect(() => {
        const [key, refId] = startParam.split('ref=');
        if(refId){
            saveInLocalStorage(REF_HEADER, refId);
        }
    }, [startParam]);

    const [serviceId, variantId] = startParam.split('_').filter((_, i) => i % 2 !== 0);

    const {data: userinfo} = useGetUserInfoQuery(undefined, {
        skip: !isReady
    });
    const isLoading = useMemo(() => Boolean(!userinfo), [userinfo])
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
    }, [serviceId, variantId, services, dispatch, navigate]);

    if (!userinfo || isLoading || !isReady) {
        return <div>
            <Skeleton className="w-full h-[50px] mb-3 rounded-none"/>
            <div className="mb-6 mt-4 px-4 flex flex-col gap-4">
                <Skeleton className="w-full h-[88px]"/>
                <Skeleton className="w-full h-[88px]"/>
                <Skeleton className="w-full h-[88px]"/>
                <Skeleton className="w-full h-[88px]"/>
                <Skeleton className="w-full h-[88px]"/>
            </div>
            <Skeleton className="w-full rounded-none menu-container"/>
        </div>
    }

    if (userinfo.role === 'admin') {
        return <div className="content-wrapper">
            <Routes>
                <Route element={<AdminLayout/>}>
                    <Route path={RoutePaths.Root} element={<MainPage/>}/>
                    <Route path={RoutePaths.Orders} element={<ClientOrdersPage/>}/>
                    <Route path={RoutePaths.Bonuses} element={<div className="p-4">Бонусы</div>}/>
                    <Route path={RoutePaths.Profile} element={<ProfilePage/>}/>
                </Route>
                <Route path={RoutePaths.Order.Create} element={<OrderCreationPage/>}/>
                <Route path={RoutePaths.Order.Checkout} element={<OrderCheckoutPage/>}/>
                <Route path={RoutePaths.Order.Details(':id')} element={<OrderDetailsPage/>}/>
                <Route path={RoutePaths.Application} element={<ApplicationPage/>}/>
                <Route path="*" element={<Navigate to={RoutePaths.Root}/>}/>
            </Routes>
        </div>
    }

    if (userinfo.role === 'executor') {
        return <div className="content-wrapper">
            <Routes>
                <Route element={<ExecutorLayout/>}>
                    <Route path={RoutePaths.Executor.Orders} element={<ExecutorOrdersPage/>}/>
                    <Route path={RoutePaths.Executor.Payments} element={<ExecutorPaymentsPage/>}/>
                    <Route path={RoutePaths.Executor.Schedule} element={<ExecutorSchedulePage/>}/>
                    <Route path={RoutePaths.Executor.Profile} element={<ProfilePage/>}/>
                    <Route path="*" element={<Navigate to={RoutePaths.Executor.Orders}/>}/>
                </Route>
                <Route path={RoutePaths.Executor.Details(':id')} element={<ExecutorOrderDetailsPage/>}/>
            </Routes>
        </div>
    }


    return (
        <div className="content-wrapper">
            <Routes>
                <Route element={<ClientLayout/>}>
                    <Route path={RoutePaths.Root} element={<MainPage/>}/>
                    <Route path={RoutePaths.Orders} element={<ClientOrdersPage/>}/>
                    <Route path={RoutePaths.Bonuses} element={<GiftsPage/>}/>
                    <Route path={RoutePaths.Profile} element={<ProfilePage/>}/>
                </Route>
                <Route path={RoutePaths.Order.Create} element={<OrderCreationPage/>}/>
                <Route path={RoutePaths.Order.Checkout} element={<OrderCheckoutPage/>}/>
                <Route path={RoutePaths.Order.Details(':id')} element={<OrderDetailsPage/>}/>
                <Route path={RoutePaths.Application} element={<ApplicationPage/>}/>
                <Route path="*" element={<Navigate to={RoutePaths.Root}/>}/>
            </Routes>
        </div>
    )
}

export default App
