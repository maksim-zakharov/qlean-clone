import { Route, Routes } from "react-router-dom"
import React from "react"
import ClientOrdersPage from "./client-orders/ClientOrdersPage"
import { Layout } from "./components/layout/Layout"

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<ClientOrdersPage />} />
        <Route path="/orders" element={<div className="p-4">Заказы</div>} />
        <Route path="/bonuses" element={<div className="p-4">Бонусы</div>} />
        <Route path="/profile" element={<div className="p-4">Профиль</div>} />
      </Route>
    </Routes>
  )
}

export default App
