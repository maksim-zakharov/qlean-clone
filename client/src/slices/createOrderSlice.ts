import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {api} from "../api.ts";

interface CreateOrderState {
    baseService?: any;
    options: any[];
    serviceVariant?: any;

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
    state.baseService = null;
    state.serviceVariant = null;
    state.options = [];
    state.fullAddress = null;

    saveInLocalStorage('baseService', state.baseService)
    saveInLocalStorage('serviceVariant', state.serviceVariant)
    saveInLocalStorage('options', null)
    saveInLocalStorage('fullAddress', state.fullAddress)
}

const initialState: CreateOrderState = {
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
        selectBaseService: (state, action: PayloadAction<Pick<CreateOrderState, 'baseService' | 'serviceVariant' | 'options'>>) => {
            state.baseService = action.payload.baseService;
            state.serviceVariant = action.payload.serviceVariant;
            state.options = action.payload.options;

            saveInLocalStorage('baseService', state.baseService)
            saveInLocalStorage('serviceVariant', state.serviceVariant)
            saveInLocalStorage('options', state.options)
        },
        selectFullAddress: (state, action: PayloadAction<Pick<CreateOrderState, 'fullAddress'>>) => {
            state.fullAddress = action.payload;
            saveInLocalStorage('fullAddress', state.fullAddress)
        },
        clearState: _clearState,

        // selectServiceVariant: (state, action: PayloadAction<number>) => {
        //     state.selectedServiceVariantId = action.payload;
        // },
        //
        // toggleServiceOption: (state, action: PayloadAction<number>) => {
        //     const index = state.selectedOptions.indexOf(action.payload);
        //     if (index >= 0) {
        //         state.selectedOptions.splice(index, 1);
        //     } else {
        //         state.selectedOptions.push(action.payload);
        //     }
        // },
        //
        // setAddress: (state, action: PayloadAction<string>) => {
        //     state.address = action.payload;
        // },

        // setDate: (state, action: PayloadAction<Date>) => {
        //     state.date = action.payload;
        // },
        //
        // calculateTotalPrice: (state, action: PayloadAction<{
        //     variantPrice: number;
        //     optionsPrice: number;
        // }>) => {
        //     state.totalPrice = action.payload.variantPrice + action.payload.optionsPrice;
        // },

        resetOrder: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(api.endpoints.addOrder.matchFulfilled, _clearState)
    },
});

export const {
    selectBaseService,
    selectFullAddress,
    clearState
} = createOrderSlice.actions;

// export const selectCreateOrder = (state: RootState) => state.createOrder;

export default createOrderSlice;