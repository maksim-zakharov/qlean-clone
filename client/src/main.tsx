import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './index.css'  // Импорт Tailwind
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "./store.ts";
import updateLocale from 'dayjs/plugin/updateLocale' // ES 2015
import 'dayjs/locale/ru';
import dayjs from "dayjs";

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
            </Provider>
        </BrowserRouter>
    </StrictMode>
)
