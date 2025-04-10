import {Route, Routes, useNavigate, useSearchParams} from "react-router-dom"
import {Layout} from "./components/layout/Layout"
import MainPage from "./features/MainPage.tsx"
import {OrderCreationPage} from "./features/OrderCreationPage.tsx"
import {OrderCheckoutPage} from "./features/OrderCheckoutPage.tsx"
import {OrdersPage} from "./features/OrdersPage.tsx";
import {useGetServicesQuery, useGetUserInfoQuery} from "./api.ts";
import {OrderDetailsPage} from "./features/OrderDetailsPage.tsx";
import {ProfilePage} from "./features/ProfilePage.tsx";
import {RoutePaths} from "./routes.ts";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {startOrderFlow} from "./slices/createOrderSlice.ts";

function App() {
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const startParam = Telegram.WebApp.initDataUnsafe.start_param || searchParams.get('tgWebAppStartParam') || searchParams.get('startapp') || '';

    const [serviceId, variantId] = startParam.split('_').filter((_, i) => i % 2 !== 0);

    useGetUserInfoQuery();
    const {data: services = []} = useGetServicesQuery();

    useEffect(() => {
        if (serviceId && services?.length > 0) {
            // Загрузка данных
            const baseService = services.find((service) => service.id?.toString() === serviceId);
            const serviceVariant = baseService?.variants?.find((variant) => variant.id.toString() === variantId);
            if (!baseService)
                return;

            dispatch(startOrderFlow({baseService, serviceVariant}))
            navigate(RoutePaths.Order.Create);
        }
    }, [serviceId, variantId, services]);

    return (
        <Routes>
            <Route element={<Layout/>}>
                <Route path={RoutePaths.Root} element={<MainPage/>}/>
                <Route path={RoutePaths.Orders} element={<OrdersPage/>}/>
                <Route path={RoutePaths.Bonuses} element={<div className="p-4">Бонусы</div>}/>
            </Route>
            <Route path={RoutePaths.Order.Create} element={<OrderCreationPage/>}/>
            <Route path={RoutePaths.Order.Checkout} element={<OrderCheckoutPage/>}/>
            <Route path={RoutePaths.Order.Details(':id')} element={<OrderDetailsPage/>}/>
            <Route path={RoutePaths.Profile} element={<ProfilePage/>}/>
        </Routes>
    )
}

export default App
