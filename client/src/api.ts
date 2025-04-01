import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {ServiceCategory} from "./features/order-creation/types.ts";

export const api = createApi({
    reducerPath: "api",
    tagTypes: [
        "Service", "Order", 'Address'
    ],
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NODE_ENV !== 'production' ? "http://localhost:3000" : ''
    }),
    endpoints: (builder) => ({
        getServices: builder.query<ServiceCategory[], void>({
            query: () => ({
                url: "/services"
            }),
            providesTags: ['Service'],
        }),
        getOrders: builder.query<any[], { userId?: number }>({
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
        getAddresses: builder.query<any[], { userId?: number }>({
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
    })
});

export const {
    useGetServicesQuery,
    useGetOrdersQuery,
    useAddOrderMutation,
    useGetAddressesQuery,
    useAddAddressMutation,
    useEditAddressMutation,
    useDeleteAddressMutation,
} = api;