import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { getResponse } from '../services/api/genResponse';
import { AIModel } from '../model/AIModel';
import { setFileOutput, setInstruction, setModel, setPersona, submitFailure, submitStart, submitSuccess } from '../store/slices/formSlice';
import { Persona } from '../model/persona';


export const useForm = () => {
    const dispatch = useAppDispatch();
    const { file, fileName } = useAppSelector((state) => state.file)
    const { model, personas, responseInJson, instruction: responsePrompt, isSubmitting, error, isSubmitted } = useAppSelector((state) => state.form)
    const [returnFormat, setReturnFormat] = useState("csv");

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
                `A ${persona.age} years old, ${persona.gender}, from ${persona.location} who is a ${persona.job}, ${persona.description}.`
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
            if (data === "json") {
                dispatch(setFileOutput(true));
            } else {
                dispatch(setFileOutput(false));
            }
        },
        [dispatch]
    );


    const submitForm = useCallback(
        async () => {
            const personaDescriptions: string[] = personaParser();
            dispatch(submitStart());
            const res = await getResponse({ model_name: "gpt-4o-mini", instructions: responsePrompt, personaDescriptions: personaDescriptions, responseInJson });
            if (res.error) {
                dispatch(submitFailure(res.error));
            }
            dispatch(submitSuccess());
            // set the url here, deduct tokens, and update history if the user has a premium subscription 
        },
        [dispatch]);

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
    };
};

export default useForm;