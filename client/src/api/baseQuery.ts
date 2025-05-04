import {Mutex} from "async-mutex";
import {saveToken} from "../slices/createOrderSlice.ts";
import {BaseQueryApi, fetchBaseQuery} from "@reduxjs/toolkit/query";

const mutex = new Mutex();

const baseQuery = () =>
    fetchBaseQuery({
        baseUrl: '/api',
        prepareHeaders: (headers, {getState}: any) => {
            const token = getState().createOrder.token;

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }

            return headers;
        },
    });

export const TELEGRAM_HEADER = 'telegram-init-data';

export const baseQueryWithReauth = async (args, api: BaseQueryApi, extraOptions) => {
    let result = await baseQuery()(args, api, extraOptions);

    if (result?.error?.status === 401) {
        if (!mutex.isLocked()) {
            const release = await mutex.acquire();
            try {
                const refreshResult = await baseQuery()({
                    url: '/auth/login',
                    headers: {
                        [TELEGRAM_HEADER]: Telegram.WebApp?.initData
                    },
                    method: 'POST'
                }, api, extraOptions);

                api.dispatch(saveToken({token: refreshResult?.data?.access_token}))

                if (refreshResult?.meta?.response?.status === 200) {
                    result = await baseQuery()(args, api, extraOptions);
                }
            } finally {
                release();
            }
        } else {
            await mutex.waitForUnlock();
            result = await baseQuery()(args, api, extraOptions);
        }
    }

    return result;
}