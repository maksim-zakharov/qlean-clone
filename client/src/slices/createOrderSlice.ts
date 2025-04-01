import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CreateOrderState {
    baseService?: any;
    options: any[];
    serviceVariant?: any;

    fullAddress?: any;
    date?: number;
}

const initialState: CreateOrderState = {
    baseService: null,
    options: [],
    serviceVariant: null,
    fullAddress: null,
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
        },
        selectFullAddress: (state, action: PayloadAction<Pick<CreateOrderState, 'fullAddress'>>) => {
            state.fullAddress = action.payload;
        },

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
    // extraReducers: (builder) => {
    //     builder
    //         .addCase(createOrder.pending, (state) => {
    //             state.isLoading = true;
    //             state.error = null;
    //         })
    //         .addCase(createOrder.fulfilled, (state) => {
    //             state.isLoading = false;
    //             Object.assign(state, initialState);
    //         })
    //         .addCase(createOrder.rejected, (state, action) => {
    //             state.isLoading = false;
    //             state.error = action.payload as string;
    //         });
    // },
});

export const {
    selectBaseService,
    selectFullAddress,
} = createOrderSlice.actions;

// export const selectCreateOrder = (state: RootState) => state.createOrder;

export default createOrderSlice;