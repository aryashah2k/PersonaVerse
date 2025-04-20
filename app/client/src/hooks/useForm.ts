import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchSurveyHistory } from '../services/api/surveyHistory';
import { addSurveyHistory, setSurveyHistory } from '../store/slices/surveyHistorySlice';
import SurveyHistory from '../model/surveyHistory';
import { getResponse } from '../services/api/genResponse';


export const useForm = () => {
    const dispatch = useAppDispatch();
    const { file, fileName } = useAppSelector((state) => state.file)
    const { model, personas } = useAppSelector((state) => state.form)

    const personaParser = (): string[] => {
        return personas.map(
            (persona) =>
                `A ${persona.age} years old, ${persona.gender}, from ${persona.location} who is a ${persona.job}, ${persona.description}.`
        );
    };


    const fetchSurveyResponseResult = useCallback(
        async () => {
            const personaDescriptions: string[] = personaParser();
            const res = await getResponse({ model_name: "gpt-4o-mini", instructions: "something or the other", personaDescriptions: personaDescriptions });
        },
        [dispatch]);

    return {
        fetchSurveyResponseResult,
    };
};

export default useForm;