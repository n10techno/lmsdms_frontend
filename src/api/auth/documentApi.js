// src/api/documentApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from 'constants/config';

export const documentApi = createApi({
    reducerPath: 'documentApi',
    baseQuery: fetchBaseQuery({
        baseUrl: config.BACKEND_API_URL,
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
            query: (documentData) => ({
                url: 'dms_module/create_document',
                method: 'POST',
                body: documentData,
            }),
            transformResponse: (response) => response.data,
        }),

        createDocumentType: builder.mutation({
            query: (documentTypeData) => ({
                url: 'dms_module/create_get_document_type',
                method: 'POST',
                body: documentTypeData,
            }),
            transformResponse: (response) => response.data,
        }),

        fetchDocumentTypes: builder.query({
            query: () => ({
                url: 'dms_module/get_document_type',
                method: 'GET',
            }),
            transformResponse: (response) => response.data,
        }),

        fetchDocuments: builder.query({
            query: () => 'dms_module/view_document',
            transformResponse: (response) => response.data,
        }),
    }),
});

export const { 
    useCreateDocumentMutation, 
    useCreateDocumentTypeMutation, 
    useFetchDocumentTypesQuery,
    useFetchDocumentsQuery, 
} = documentApi;
