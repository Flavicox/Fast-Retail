import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const predictionApi = createApi({
    reducerPath: 'predictionApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://demand-forecast-my51.onrender.com/',
    }),
    endpoints: () => ({}), // endpoints se agregan luego
})
