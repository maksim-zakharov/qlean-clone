import {Route, Routes} from "react-router-dom"
import {Layout} from "./components/layout/Layout"
import MainPage from "./MainPage/MainPage.tsx"
import {OrderCreationPage} from "./features/order-creation/OrderCreationPage"
import {OrderCheckoutPage} from "./features/order-checkout/OrderCheckoutPage"
import {OrdersPage} from "./features/OrdersPage.tsx";
import {useGetServicesQuery} from "./api.ts";

function App() {
    useGetServicesQuery();

    return (
        <Routes>
            <Route element={<Layout/>}>
                <Route path="/" element={<MainPage/>}/>
                <Route path="/orders" element={<OrdersPage/>}/>
                <Route path="/bonuses" element={<div className="p-4">Бонусы</div>}/>
                <Route path="/profile" element={<div className="p-4">Профиль</div>}/>
            </Route>
            <Route path="/order/:serviceId" element={<OrderCreationPage/>}/>
            <Route path="/order/:serviceId/checkout" element={<OrderCheckoutPage/>}/>
        </Routes>
    )
}

export default App
