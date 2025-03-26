import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './index.css'  // Импорт Tailwind
import {HashRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "./store.ts";


import { init, miniApp } from '@telegram-apps/sdk';


const initializeTelegramSDK = async () => {
    try {
        await init();


        if (miniApp.ready.isAvailable()) {
            await miniApp.ready();
            console.log('Mini App готово');
        }


    } catch (error) {
        console.error('Ошибка инициализации:', error);
    }
};


initializeTelegramSDK();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <HashRouter>
            <Provider store={store}>
                <App/>
            </Provider>
        </HashRouter>
    </StrictMode>
)
