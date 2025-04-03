import {Route, Routes} from "react-router-dom"
import {Layout} from "./components/layout/Layout"
import MainPage from "./features/MainPage.tsx"
import {OrderCreationPage} from "./features/OrderCreationPage.tsx"
import {OrderCheckoutPage} from "./features/OrderCheckoutPage.tsx"
import {OrdersPage} from "./features/OrdersPage.tsx";
import {useGetServicesQuery, useGetUserInfoQuery} from "./api.ts";
import {OrderDetailsPage} from "./features/OrderDetailsPage.tsx";

function App() {
    useGetServicesQuery();
    useGetUserInfoQuery();

    return (
        <Routes>
            <Route element={<Layout/>}>
                <Route path="/" element={<MainPage/>}/>
                <Route path="/orders" element={<OrdersPage/>}/>
                <Route path="/bonuses" element={<div className="p-4">Бонусы</div>}/>
                <Route path="/profile" element={<div className="p-4">Профиль</div>}/>
            </Route>
            <Route path="/order" element={<OrderCreationPage/>}/>
            <Route path="/order/checkout" element={<OrderCheckoutPage/>}/>
            <Route path="/order/:id" element={<OrderDetailsPage/>}/>
        </Routes>
    )
}

export default App
