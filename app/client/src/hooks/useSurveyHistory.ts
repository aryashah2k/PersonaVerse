import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchSurveyHistory } from '../services/api/surveyHistory';
import { addSurveyHistory, setSurveyHistory } from '../store/slices/surveyHistorySlice';
import SurveyHistory from '../model/surveyHistory';


export const useSurveyHistory = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth)
    const { surveyHistory } = useAppSelector((state) => state.surveyHistory)
    const fetchHistory = async () => {

        const res = await fetchSurveyHistory()

        if (res.error || res.data === null || res.data.length === 0) {
            throw new Error(res.error ? res.error : "No History available");
        }
        else {
            dispatch(setSurveyHistory(res.data));
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [dispatch, user]);

    const updateSurveyHistory = useCallback(
        async (data: SurveyHistory | null) => {
            try {
                if (data) {
                    dispatch(addSurveyHistory(data));
                    return { success: true };
                }
            } catch (error) {
                return { success: false, error: error instanceof Error ? error.message : 'Failed to update History' };
            }
        },
        [dispatch]);

    return {
        surveyHistory
    };
};

export default useSurveyHistory;