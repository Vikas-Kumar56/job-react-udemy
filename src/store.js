import { configureStore } from '@reduxjs/toolkit';
import jobReducer from './features/job/jobSlice';

export const store = configureStore({
  reducer: {
    jobs: jobReducer,
  },
});
