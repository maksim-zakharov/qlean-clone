import {Route, Routes} from "react-router-dom";
import React from "react";
import ClientOrdersPage from "./client-orders/ClientOrdersPage.tsx";

function App() {

    const menuItems = [
        {key: '/', label: 'Главная', element: <ClientOrdersPage/>},
    ]

  return (
    <>

        <Routes>
            {menuItems.map(item => <Route path={item.key} element={item.element}/>)}
        </Routes>
    </>
  )
}

export default App
