import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import fileReducer from './slices/fileSlice';
import personaReducer from './slices/personaSlice';
import processReducer from './slices/processSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    file: fileReducer,
    persona: personaReducer,
    process: processReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
