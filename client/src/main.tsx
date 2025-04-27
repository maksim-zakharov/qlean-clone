import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './index.css'  // Импорт Tailwind
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "./store.ts";
import duration from 'dayjs/plugin/duration'
import updateLocale from 'dayjs/plugin/updateLocale' // ES 2015
import 'dayjs/locale/ru';
import dayjs from "dayjs";
import {Toaster} from "sonner";

dayjs.extend(duration)
dayjs.extend(updateLocale)

dayjs.locale('ru'); // Активируем русскую локаль

// Ручная настройка названий месяцев в родительном падеже
dayjs.updateLocale('ru', {
    months: [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ]
});


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <App/>
                <Toaster duration={1500}/>
            </Provider>
        </BrowserRouter>
    </StrictMode>
)
