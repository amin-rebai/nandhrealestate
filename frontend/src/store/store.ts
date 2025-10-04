import { configureStore } from '@reduxjs/toolkit';
import propertyReducer from './slices/propertySlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    properties: propertyReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
