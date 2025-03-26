import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './index.css'  // Импорт Tailwind
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "./store.ts";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Provider store={store}>
                <App/>
            </Provider>
        </BrowserRouter>
    </StrictMode>
)
