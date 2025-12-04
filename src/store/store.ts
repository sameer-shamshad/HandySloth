import authReducer from './features/AuthReducer';
import userReducer from './features/userReducer';
import { configureStore } from '@reduxjs/toolkit';
import { authMiddleware } from './middleware/authMiddleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;