import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

import { ProductListing } from '../../app/types';

type ProductState = {
    isLoading: boolean;
    error: null | string;
    productList: ProductListing[];
    product: ProductListing | null;
    totalPageNumber: number;
};

const initialState = {
    isLoading: false,
    error: null,
    productList: [],
    product: null,
    totalPageNumber: 0
} as ProductState;

export const fetchProducts = createAsyncThunk('products/getProducts', async (page: number, thunkApi) => {
    try {
        const response = await axios.get(`https://mightyjaxx-dashboard.herokuapp.com/products?page=${page}`);
        return response.data;
    } catch (err: any) {
        return thunkApi.rejectWithValue(err.response);
    }
});

export const getProduct = createAsyncThunk('products/getProduct', async (id: string, thunkApi) => {
    try {
        const response = await axios.get(`https://mightyjaxx-dashboard.herokuapp.com/products/${id}`);
        return response.data;
    } catch (err: any) {
        return thunkApi.rejectWithValue(err.response);
    }
});

export const editProduct = createAsyncThunk('products/editProduct', async ({ oldID, formData }: { oldID: string; formData: FormData }, thunkApi) => {
    try {
        const response = await axios.patch(`https://mightyjaxx-dashboard.herokuapp.com/products/${oldID}`, Object.fromEntries(formData), {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (err: any) {
        return thunkApi.rejectWithValue(err.response);
    }
});

export const addProduct = createAsyncThunk('products/addProduct', async (formData: FormData, thunkApi) => {
    try {
        const response = await axios.post(`https://mightyjaxx-dashboard.herokuapp.com/products`, Object.fromEntries(formData), {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (err: any) {
        return thunkApi.rejectWithValue(err.response);
    }
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id: number, thunkApi) => {
    try {
        const response = await axios.delete(`https://mightyjaxx-dashboard.herokuapp.com/products/${id}`);
        return response.data;
    } catch (err: any) {
        return thunkApi.rejectWithValue(err.response);
    }
});

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        productPending: (state) => {
            state.isLoading = true;
        },
        getProductSuccess: (state, action) => {
            state.isLoading = false;
            state.productList = action.payload;
        },
        productFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        writeProductSuccess: (state) => {
            state.isLoading = false;
        },
        resetData: (state) => {
            state.productList = [];
            state.isLoading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(
                fetchProducts.fulfilled,
                (
                    state,
                    {
                        payload
                    }: PayloadAction<{
                        productList: ProductListing[];
                        totalPageNumber: number;
                    }>
                ) => {
                    state.isLoading = false;
                    state.totalPageNumber = payload.totalPageNumber;
                    state.productList = payload.productList;
                }
            )
            .addCase(fetchProducts.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(addProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addProduct.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(addProduct.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(getProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProduct.fulfilled, (state, { payload }: PayloadAction<ProductListing>) => {
                state.isLoading = false;
                state.product = payload;
            })
            .addCase(getProduct.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(editProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(editProduct.fulfilled, (state, action: PayloadAction<ProductListing[]>) => {
                state.isLoading = false;
                state.productList = action.payload;
            })
            .addCase(editProduct.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(deleteProduct.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(deleteProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(
                deleteProduct.fulfilled,
                (
                    state,
                    {
                        payload
                    }: PayloadAction<{
                        productList: ProductListing[];
                        totalPageNumber: number;
                    }>
                ) => {
                    state.isLoading = false;
                    state.totalPageNumber = payload.totalPageNumber;
                    state.productList = payload.productList;
                }
            );
    }
});

export const { productPending, getProductSuccess, productFailure, writeProductSuccess, resetData } = productSlice.actions;

export default productSlice.reducer;
