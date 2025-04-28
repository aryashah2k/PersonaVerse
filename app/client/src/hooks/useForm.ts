import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { getResponse } from '../services/api/genResponse';
import { AIModel } from '../model/AIModel';
import { resetFormState, setActiveStep, setFileOutput, setInstruction, setModel, setPersona, setSurveyResponse, submitFailure, submitStart, submitSuccess } from '../store/slices/formSlice';
import { Persona } from '../model/persona';
import { setLoadingFalse, setLoadingTrue } from '../store/slices/appLoadingSlice';
import { deductTokens } from '../store/slices/authSlice';
import useSurveyHistory from './useSurveyHistory';


export const useForm = () => {
    const dispatch = useAppDispatch();
    const { file, fileName } = useAppSelector((state) => state.file)
    const { model, personas, responseInJson, instruction: responsePrompt, isSubmitting, error, isSubmitted, activeStep, surveyResponse } = useAppSelector((state) => state.form)
    const [returnFormat, setReturnFormat] = useState("csv");
    const { updateSurveyHistory } = useSurveyHistory();

    useEffect(() => {
        if (responseInJson) {
            setReturnFormat("json");
        } else {
            setReturnFormat("csv");
        }
    }, [responseInJson]);
    // helper function to submitForm
    const personaParser = (): string[] => {
        return personas.map(
            (persona) =>
                `${persona.name}, a ${persona.age} years old, ${persona.gender}, from ${persona.location} who is a ${persona.job}, ${persona.description}.`
        );
    };

    const selectModel = useCallback(
        async (data: AIModel) => {
            dispatch(setModel(data));
        },
        [dispatch]
    );
    const selectPersona = useCallback(
        async (data: Persona) => {
            dispatch(setPersona(data));
        },
        [dispatch]
    );
    const setResponsePrompt = useCallback(
        async (data: string) => {
            dispatch(setInstruction(data));
        }, [dispatch]
    );
    const setResponseFormat = useCallback(
        async (data: string) => {
            if (data == "csv") {
                dispatch(setFileOutput(false));
            } else if (data == "json") {
                dispatch(setFileOutput(true));
            }
        },
        [dispatch]
    );
    const setDashboardActiveStep = useCallback(

        async (data: number) => {
            dispatch(setActiveStep(data));
        },
        [dispatch]
    );

    const setPageError = useCallback(
        (error: string) => {
            dispatch(submitFailure(error));
        },
        [dispatch]
    );

    const submitForm = useCallback(
        async () => {
            try {
                const personaDescriptions: string[] = personaParser();
                dispatch(submitStart());
                const res = await getResponse({ file: file, model_id: model?.id, instructions: responsePrompt, personaDescriptions: personaDescriptions, responseInJson });

                if (res.error) {
                    dispatch(submitFailure(res.error));
                }
                else {
                    dispatch(deductTokens(res.data!.tokensUsed));
                    dispatch(setSurveyResponse(res.data!));
                    dispatch(setActiveStep(3));
                    updateSurveyHistory();
                    dispatch(submitSuccess());

                }
            } catch (e) {
                dispatch(submitFailure("Something went wrong"));
            }
            // set the url here, deduct tokens, and update history if the user has a premium subscription 
        },
        [dispatch, file, responseInJson, responsePrompt]);

    const resetForm = useCallback(

        () => {
            dispatch(resetFormState());
        },
        [dispatch]
    );

    return {
        selectedModel: model,
        selectedPersonas: personas,
        uploadedFile: file,
        uploadedFileName: fileName,
        responsePrompt,
        responseFormat: returnFormat,
        selectModel,
        selectPersona,
        setResponsePrompt,
        setResponseFormat,
        submitForm,
        isSubmitting,
        isSubmitted,
        error,
        setDashboardActiveStep,
        activeStep,
        setPageError,
        resetForm,
        surveyResponse
    };
};

export default useForm;