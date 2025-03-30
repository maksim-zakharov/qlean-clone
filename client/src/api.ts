import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {ServiceCategory} from "./features/order-creation/types.ts";

export const api = createApi({
    reducerPath: "api",
    tagTypes: [
        "User"
    ],
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NODE_ENV !== 'production' ? "http://localhost:3000" : '/api'
    }),
    endpoints: (builder) => ({
        getServices: builder.query<ServiceCategory[], void>({
            query: (params) => ({
                url: "/services",
                params
            })
        }),
        getOrders: builder.query<any[], { userId?: number }>({
            query: (params) => ({
                url: "/orders",
                params
            })
        }),
        addOrder: builder.mutation<any, any>({
            query: (params) => ({
                url: "/orders",
                method: 'POST',
                body: params,
            })
        }),
    })
});

export const {
    useGetServicesQuery,
    useGetOrdersQuery,
    useAddOrderMutation
} = api;