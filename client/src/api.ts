import {BaseQueryApi, createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {Mutex} from 'async-mutex';
import {saveToken} from "./slices/createOrderSlice.ts";

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

const TELEGRAM_HEADER = 'telegram-init-data';

const baseQueryWithReauth = async (args, api: BaseQueryApi, extraOptions) => {
    let result = await baseQuery()(args, api, extraOptions);
    const token = api.getState().createOrder.token;

    if (result?.error?.status === 401) {
        if (!mutex.isLocked()) {
            const release = await mutex.acquire();
            try {
                const refreshResult = await baseQuery()({
                    url: '/auth/login',
                    headers: {
                        [TELEGRAM_HEADER]: Telegram.WebApp?.initData
                    }
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

export const api = createApi({
    reducerPath: "api",
    tagTypes: [
        "Service", "Order", 'Address', 'User', 'Schedule', 'Application'
    ],
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getUserInfo: builder.query<void, void>({
            query: () => '/auth/userinfo',
            providesTags: ['User'],
        }),
        login: builder.mutation<void, void>({
            query: () => ({
                url: '/auth/login',
                method: 'GET',
                headers: { [TELEGRAM_HEADER]: Telegram.WebApp?.initData }
            }),
        }),
        getServices: builder.query<any[], void>({
            query: () => ({
                url: "/services"
            }),
            providesTags: ['Service'],
        }),
        getOrderById: builder.query<any, { id: number | string }>({
            query: (params) => ({
                url: `/orders/${params.id}`,
                params
            }),
            providesTags: ['Order'],
        }),
        getOrders: builder.query<any[], void>({
            query: (params) => ({
                url: "/orders",
                params
            }),
            providesTags: ['Order'],
        }),
        updateSchedule: builder.mutation<any, any>({
            query: (params) => ({
                url: "/schedule",
                method: 'PUT',
                body: params,
            }),
            invalidatesTags: ['Schedule'],
        }),
        getSchedule: builder.query<any, any>({
            query: () => ({
                url: "/schedule",
            }),
            providesTags: ['Schedule'],
        }),
        addOrder: builder.mutation<any, any>({
            query: (params) => ({
                url: "/orders",
                method: 'POST',
                body: params,
            }),
            invalidatesTags: ['Order'],
        }),
        editOrder: builder.mutation<any, any>({
            query: (params) => ({
                url: `/orders/${params.id}`,
                method: 'PUT',
                body: params,
            }),
            invalidatesTags: ['Order'],
        }),
        cancelOrder: builder.mutation<any, any>({
            query: (params) => ({
                url: `/orders/${params.id}/cancel`,
                method: 'POST',
                body: params,
            }),
            invalidatesTags: ['Order'],
        }),
        patchOrder: builder.mutation<any, any>({
            query: (params) => ({
                url: `/orders/${params.id}`,
                method: 'PATCH',
                body: params,
            }),
            invalidatesTags: ['Order'],
        }),
        getAddresses: builder.query<any[], void>({
            query: (params) => ({
                url: "/addresses",
                params
            }),
            providesTags: ['Address'],
        }),
        addAddress: builder.mutation<any, any>({
            query: (params) => ({
                url: "/addresses",
                method: 'POST',
                body: params,
            }),
            invalidatesTags: ['Address'],
        }),
        editAddress: builder.mutation<any, any>({
            query: (params) => ({
                url: `/addresses/${params.id}`,
                method: 'PUT',
                body: params,
            }),
            invalidatesTags: ['Address'],
        }),
        deleteAddress: builder.mutation<any, any>({
            query: (params) => ({
                url: `/addresses/${params.id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Address'],
        }),
        getExecutorOrders: builder.query<any[], void>({
            query: (params) => ({
                url: "/executor/orders",
                params
            }),
            providesTags: ['Order'],
        }),
        sendApplication: builder.mutation<any, any>({
            query: (params) => ({
                url: "/application",
                method: 'POST',
                body: params,
            }),
            invalidatesTags: ['Application'],
        }),
        getApplication: builder.query<any, void>({
            query: (params) => ({
                url: "/application",
                body: params,
            }),
            providesTags: ['Application'],
        }),
    })
});

export const {
    useLoginMutation,
    useGetUserInfoQuery,
    useGetServicesQuery,
    useGetOrdersQuery,
    useAddOrderMutation,
    useGetOrderByIdQuery,
    useCancelOrderMutation,
    useEditOrderMutation,
    usePatchOrderMutation,
    useGetAddressesQuery,
    useAddAddressMutation,
    useEditAddressMutation,
    useDeleteAddressMutation,
    useGetExecutorOrdersQuery,
    useUpdateScheduleMutation,
    useGetScheduleQuery,
    useGetApplicationQuery,
    useSendApplicationMutation
} = api;