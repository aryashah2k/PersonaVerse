import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import userReducer from './slices/userSlice';
import fileReducer from './slices/fileSlice';
// import personaReducer from './slices/personaSlice';
import authReducer from './slices/authSlice';
import formReducer from './slices/formSlice';
import profileReducer from './slices/profileSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    file: fileReducer,
    // persona: personaReducer,
    auth: authReducer,
    form: formReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
