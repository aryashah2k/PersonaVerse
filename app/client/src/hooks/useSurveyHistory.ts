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

        if (res.error) {
            throw new Error(res.error ? res.error : "No History available");
        }
        else {
            if (res.data) {
                dispatch(setSurveyHistory(res.data));
            }
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [dispatch, user]);

    const updateSurveyHistory = useCallback(
        async () => {
            fetchHistory();
        },
        [dispatch]);

    return {
        surveyHistory,
        updateSurveyHistory
    };
};

export default useSurveyHistory;