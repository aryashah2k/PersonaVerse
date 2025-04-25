import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import userReducer from './slices/userSlice';
import fileReducer from './slices/fileSlice';
import personaAIReducer from './slices/personaAISlice';
import authReducer from './slices/authSlice';
import formReducer from './slices/formSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import surveyHistoryReducer from './slices/surveyHistorySlice';
import appLoadingReducer from './slices/appLoadingSlice';
export const store = configureStore({
  reducer: {
    user: userReducer,
    file: fileReducer,
    personaAI: personaAIReducer,
    auth: authReducer,
    form: formReducer,
    surveyHistory: surveyHistoryReducer,
    subscription: subscriptionReducer,
    appLoading: appLoadingReducer,
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
