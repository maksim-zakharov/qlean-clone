import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {api} from "../api.ts";

interface CreateOrderState {
    baseService?: any;
    options: any[];
    serviceVariant?: any;
    id?: number;

    fullAddress?: any;
    date?: number;
}

const getLocalStorageItemOrDefault = (key: string, defaultValue: any) => {
    const result = localStorage.getItem(key)
    if (!result) {
        return defaultValue;
    }
    return JSON.parse(result);
}

const saveInLocalStorage = (key: string, value: any) => {
    if (value) {
        localStorage.setItem(key, JSON.stringify(value))
    } else {
        localStorage.removeItem(key)
    }
}

const _clearState = (state) => {
    state.id = null;
    state.baseService = null;
    state.serviceVariant = null;
    state.options = [];
    state.fullAddress = null;

    saveInLocalStorage('id', state.id)
    saveInLocalStorage('baseService', state.baseService)
    saveInLocalStorage('serviceVariant', state.serviceVariant)
    saveInLocalStorage('options', null)
    saveInLocalStorage('fullAddress', state.fullAddress)
}

const initialState: CreateOrderState = {
    id: getLocalStorageItemOrDefault('id', null),
    baseService: getLocalStorageItemOrDefault('baseService', null),
    options: getLocalStorageItemOrDefault('options', []),
    serviceVariant: getLocalStorageItemOrDefault('serviceVariant', null),
    fullAddress: getLocalStorageItemOrDefault('fullAddress', null),
    date: 0
};

const createOrderSlice = createSlice({
    name: 'createOrder',
    initialState,
    reducers: {
        selectVariant: (state, action: PayloadAction<Pick<CreateOrderState, 'serviceVariant'>>) => {
            state.serviceVariant = action.payload.serviceVariant;
            saveInLocalStorage('serviceVariant', state.serviceVariant)
        },
        selectOptions: (state, action: PayloadAction<Pick<CreateOrderState, 'options'>>) => {
            state.options = action.payload.options;
            saveInLocalStorage('options', state.options)
        },
        selectBaseService: (state, action: PayloadAction<Pick<CreateOrderState, 'baseService' | 'serviceVariant' | 'options' | 'id'>>) => {
            state.id = action.payload.id;
            state.baseService = action.payload.baseService;
            state.serviceVariant = action.payload.serviceVariant;
            state.options = action.payload.options;

            saveInLocalStorage('id', state.id)
            saveInLocalStorage('baseService', state.baseService)
            saveInLocalStorage('serviceVariant', state.serviceVariant)
            saveInLocalStorage('options', state.options)
        },
        selectFullAddress: (state, action: PayloadAction<Pick<CreateOrderState, 'fullAddress'>>) => {
            state.fullAddress = action.payload;
            saveInLocalStorage('fullAddress', state.fullAddress)
        },
        clearState: _clearState,
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(api.endpoints.addOrder.matchFulfilled, _clearState)
    },
});

export const {
    selectBaseService,
    selectOptions,
    selectFullAddress,
    selectVariant,
    clearState
} = createOrderSlice.actions;

export default createOrderSlice;