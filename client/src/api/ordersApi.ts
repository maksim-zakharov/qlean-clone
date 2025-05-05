import { createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithReauth} from "./baseQuery.ts";

export const ordersApi = createApi({
    reducerPath: "ordersApi",
    tagTypes: [
        "Order"
    ],
    baseQuery: (...args) => baseQueryWithReauth(...args),
    endpoints: (builder) => ({
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
        processedOrder: builder.mutation<any, any>({
            query: (params) => ({
                url: `/executor/orders/${params.id}/processed`,
                method: 'POST',
                body: params,
            }),
            invalidatesTags: ['Order'],
        }),
        completeOrder: builder.mutation<any, any>({
            query: (params) => ({
                url: `/executor/orders/${params.id}/complete`,
                method: 'POST',
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
        getExecutorOrders: builder.query<any[], void>({
            query: (params) => ({
                url: "/executor/orders",
                params
            }),
            providesTags: ['Order'],
        }),
        getOrderByIdFromExecutor: builder.query<any, { id: number | string }>({
            query: (params) => ({
                url: `/executor/orders/${params.id}`,
                params
            }),
            providesTags: ['Order'],
        }),
    })
});

export const {
    useGetOrdersQuery,
    useAddOrderMutation,
    useGetOrderByIdQuery,
    useCancelOrderMutation,
    useEditOrderMutation,
    useGetOrderByIdFromExecutorQuery,
    usePatchOrderMutation,
    useGetExecutorOrdersQuery,
    useCompleteOrderMutation,
    useProcessedOrderMutation,
} = ordersApi;