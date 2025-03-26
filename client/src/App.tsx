import { Route, Routes } from "react-router-dom"
import { Layout } from "./components/layout/Layout"
import MainPage from "./MainPage/MainPage.tsx"
import { OrderCreationPage } from "./features/order-creation/OrderCreationPage"

function App() {
  return (
      <Routes>
          <Route element={<Layout />}>
              <Route path="/" element={<MainPage />} />
              <Route path="/orders" element={<div className="p-4">Заказы</div>} />
              <Route path="/bonuses" element={<div className="p-4">Бонусы</div>} />
              <Route path="/profile" element={<div className="p-4">Профиль</div>} />
          </Route>
          <Route path="/order/:serviceId" element={<OrderCreationPage />} />
      </Routes>
  )
}

export default App
