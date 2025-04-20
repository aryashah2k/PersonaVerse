import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import SurveyHistory from '../../model/surveyHistory';

interface surveyHistoryState {
    surveyHistory: SurveyHistory[];
}

const initialState: surveyHistoryState = {
    surveyHistory: []
};

export const surveyHistorySlice = createSlice({
    name: 'personaAI',
    initialState,
    reducers: {
        setSurveyHistory: (state, action: PayloadAction<SurveyHistory[]>) => {
            state.surveyHistory = action.payload;
        },
        addSurveyHistory: (state, action: PayloadAction<SurveyHistory>) => {
            const history = state.surveyHistory;
            const newData = [action.payload, ...history];
            state.surveyHistory = newData;
        },

        resetSurveyHistoryState: () => initialState,
    },
});

export const {
    setSurveyHistory,
    addSurveyHistory,
} = surveyHistorySlice.actions;

export default surveyHistorySlice.reducer;
export type { surveyHistoryState }
