import { configureStore } from '@reduxjs/toolkit';
import { userApi } from './api/auth/userApi'; 
import { documentApi } from './api/auth/documentApi'; 
import { workflowApi } from './api/auth/workflowApi'; 
import { forgotPassApi } from 'api/auth/forgotpassApi';

const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer, 
    [documentApi.reducerPath]: documentApi.reducer,
    [workflowApi.reducerPath]: workflowApi.reducer, 
    [forgotPassApi.reducerPath]: forgotPassApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware, documentApi.middleware, workflowApi.middleware,forgotPassApi.middleware), 
});


if (process.env.NODE_ENV !== 'production') {
  const { enableMapSet } = require('immer');
  enableMapSet();
}

export default store;
