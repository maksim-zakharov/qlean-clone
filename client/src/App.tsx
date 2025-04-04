import {Route, Routes} from "react-router-dom"
import {Layout} from "./components/layout/Layout"
import MainPage from "./features/MainPage.tsx"
import {OrderCreationPage} from "./features/OrderCreationPage.tsx"
import {OrderCheckoutPage} from "./features/OrderCheckoutPage.tsx"
import {OrdersPage} from "./features/OrdersPage.tsx";
import {useGetServicesQuery, useGetUserInfoQuery} from "./api.ts";
import {OrderDetailsPage} from "./features/OrderDetailsPage.tsx";
import {ProfilePage} from "./features/ProfilePage.tsx";
import {RoutePaths} from "./routes.ts";

function App() {
    useGetServicesQuery();
    useGetUserInfoQuery();

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
