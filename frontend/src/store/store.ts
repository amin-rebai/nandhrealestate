import { configureStore } from '@reduxjs/toolkit';
import propertyReducer from './slices/propertySlice';
import userReducer from './slices/userSlice';
import languageReducer from './slices/languageSlice';
import contentReducer from './slices/contentSlice';
import blogReducer from './slices/blogSlice';

export const store = configureStore({
  reducer: {
    properties: propertyReducer,
    user: userReducer,
    language: languageReducer,
    content: contentReducer,
    blog: blogReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
