// src/apis/hracnowledgementApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from 'constants/config';

export const WorkflowApi = createApi({
  reducerPath: 'hracnowledgementApi',
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
    // GET method for retrieving HR acknowledgement data
    getHracnowledgement: builder.query({
      query: (id) => ({
        url: `lms_module/hracnowledgement/${id}`,
        method: 'GET',
      }),
      transformResponse: (response) => response, // Handle raw response
    }),
    createacnowledgement: builder.mutation({
      query: ({ id, remarks }) => ({
        url: `lms_module/hracnowledgement/${id}`,
        method: 'POST',
        body: { remarks },
      }),
      transformResponse: (response) => response, // Handle raw response
    }),
    createInductionCertificate: builder.mutation({
        query: (id) => ({
          url: `lms_module/inductioncertificate/${id}`,
          method: 'POST',
        }),
        transformResponse: (response) => response, // Handle raw response
      }),
  }),
});

export const {
  useGetHracnowledgementQuery, 
  useCreateacnowledgementMutation,
  useCreateInductionCertificateMutation,
} = WorkflowApi;
