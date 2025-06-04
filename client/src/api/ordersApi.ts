import { createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithReauth} from "./baseQuery.ts";

export const ordersApi = createApi({
    reducerPath: "ordersApi",
    tagTypes: [
        "Order", 'User', 'Service', 'Variant', 'Application', 'Invite'
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
        getAdminVariants: builder.query<any[], void>({
            query: (params) => ({
                url: "/admin/variants",
                params
            }),
            providesTags: ['Variant'],
        }),
        getAdminServices: builder.query<any[], void>({
            query: (params) => ({
                url: "/admin/services",
                params
            }),
            providesTags: ['Service'],
        }),
        getAdminApplicationByUserId: builder.query<any, { id: number | string }>({
            query: (params) => ({
                url: `/admin/applications/${params.id}`,
            }),
            providesTags: ['Application'],
        }),
        getAdminServicesById: builder.query<any, { id: number | string }>({
            query: (params) => ({
                url: `/admin/services/${params.id}`,
                params
            }),
            providesTags: ['Service'],
        }),
        getAdminUsers: builder.query<any[], void>({
            query: (params) => ({
                url: "/admin/users",
                params
            }),
            providesTags: ['User'],
        }),
        getAdminUserById: builder.query<any, { id: number | string }>({
            query: (params) => ({
                url: `/admin/users/${params.id}`
            }),
            providesTags: ['User'],
        }),
        getAdminOrdersByUserId: builder.query<any, { id: number | string }>({
            query: (params) => ({
                url: `/admin/users/${params.id}/orders`
            }),
            providesTags: ['Order'],
        }),
        getAdminInvitesByUserId: builder.query<any, { id: number | string }>({
            query: (params) => ({
                url: `/admin/users/${params.id}/invites`
            }),
            providesTags: ['Invite'],
        }),
        getAdminOrders: builder.query<any[], void>({
            query: (params) => ({
                url: "/admin/orders",
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
    useGetAdminUsersQuery,
    useEditOrderMutation,
    useGetAdminVariantsQuery,
    useGetAdminServicesQuery,
    useGetAdminInvitesByUserIdQuery,
    useGetAdminApplicationByUserIdQuery,
    useGetAdminUserByIdQuery,
    useGetAdminServicesByIdQuery,
    useGetOrderByIdFromExecutorQuery,
    usePatchOrderMutation,
    useGetExecutorOrdersQuery,
    useCompleteOrderMutation,
    useProcessedOrderMutation,
    useGetAdminOrdersByUserIdQuery,
    useGetAdminOrdersQuery
} = ordersApi;