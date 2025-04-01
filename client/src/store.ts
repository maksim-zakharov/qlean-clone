
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {api} from "./api.ts";
import createOrderSlice from "./slices/createOrderSlice.ts";

export const reducers = {
    [api.reducerPath]: api.reducer,
    [createOrderSlice.reducerPath]: createOrderSlice.reducer,
};

const reducer = combineReducers(reducers);

export const store = configureStore({
    reducer,
    devTools: false, // process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    })
        .concat(api.middleware) as any,
});