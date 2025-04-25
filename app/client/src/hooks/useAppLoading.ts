import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { setLoadingFalse, setLoadingTrue } from '../store/slices/appLoadingSlice';


export const useAppLoading = () => {
    const dispatch = useAppDispatch();
    const { isLoading } = useAppSelector((state) => state.appLoading);

    const setAppLoadingTrue = useCallback(
        async () => {
            dispatch(setLoadingTrue());
        },
        [dispatch]
    );
    const setAppLoadingFalse = useCallback(
        async () => {
            dispatch(setLoadingFalse());
        },
        [dispatch]
    );


    return {
        isLoading,
        setAppLoadingTrue,
        setAppLoadingFalse,
    };
};

export default useAppLoading;