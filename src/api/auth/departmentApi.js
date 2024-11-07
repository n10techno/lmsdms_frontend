// src/api/departmentApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from 'constants/config';

export const departmentApi = createApi({
  reducerPath: 'departmentApi',
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
    createDepartment: builder.mutation({
      query: ({ department_name, department_description }) => ({
        url: 'lms_module/create_get_department',
        method: 'POST',
        body: { department_name, department_description },
      }),
      transformResponse: (response) => {
        if (response.status) {
          return response.message;
        }
        throw new Error(response.message || 'Failed to create department');
      },
    }),

    fetchDepartments: builder.query({
      query: () => ({
        url: 'lms_module/get_department',
        method: 'GET',
      }),
      transformResponse: (response) => {
        if (response.status) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to fetch departments');
      },
    }),

    updateDeleteDepartment: builder.mutation({
      query: ({ department_id, department_name, department_description }) => ({
        url: `lms_module/update_delete_department/${department_id}`,
        method: 'PUT',
        body: { department_name, department_description },
      }),
      transformResponse: (response) => {
        if (response.status) {
          return response.message;
        }
        throw new Error(response.message || 'Failed to update/delete department');
      },
    }),
  }),
});

export const {
  useCreateDepartmentMutation,
  useFetchDepartmentsQuery,
  useUpdateDeleteDepartmentMutation,
} = departmentApi;
