// src/api/documentApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from 'constants/config';

export const documentApi = createApi({
    reducerPath: 'documentApi',
    baseQuery: fetchBaseQuery({
        baseUrl: config.BACKEND_API_URL, // Access BACKEND_API_URL from the config
        prepareHeaders: (headers) => {
            const token = sessionStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    endpoints: (builder) => ({
        createDocument: builder.mutation({
            query: (body) => ({
                url: 'dms_module/CreateDocument', // Adjust the endpoint as necessary
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const { useCreateDocumentMutation } = documentApi;
