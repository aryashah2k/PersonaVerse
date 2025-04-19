import { useCallback, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchSubscriptionPlans } from '../services/api/plansApi';
import { clearSubscriptionState, setSubscriptionState } from '../store/slices/subscriptionSlice';


export const useSubscription = () => {
    const dispatch = useAppDispatch();
    const { subscription } = useAppSelector((state) => state.subscription)
    const [hasPlan, setHasPlan] = useState(false);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const res = await fetchSubscriptionPlans()

                if (res.error || res.data === null || res.data.length === 0) {
                    throw new Error(res.error ? res.error : "No plans available");
                }
                else {
                    dispatch(setSubscriptionState(res.data));
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setHasPlan(true);
            }
        };
        fetchSubscriptions();
    }, [dispatch]);

    const clearAuthError = useCallback(() => {
        dispatch(clearSubscriptionState());
        setHasPlan(false);
    }, [dispatch]);

    return {
        subscription,
        initialized: hasPlan,
        clearAuthError,
    };
};

export default useSubscription;