// src/services/predictionApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface PredictRequest {
    UnitPrice: number;
    Discount: number;
    ShippingCost: number;
    Category: string;
    PaymentMethod: string;
    SalesChannel: string;
    InvoiceDate: string;
}

interface PredictResponse {
    predicted_quantity: number;
}

export const predictionApi = createApi({
    reducerPath: "predictionApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
    }),
    endpoints: (builder) => ({
        predict: builder.mutation<PredictResponse, PredictRequest>({
            query: (body) => ({
                url: "predict",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const { usePredictMutation } = predictionApi;
