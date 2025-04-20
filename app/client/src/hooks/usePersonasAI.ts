import { useCallback, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchAIModels, fetchPersonas } from '../services/api/personaAI';
import { setModels, setPersonas } from '../store/slices/personaAISlice';


export const usePersonasAI = () => {
    const dispatch = useDispatch();
    const { models, personas } = useAppSelector((state) => state.personaAI)

    const fetchModels = async () => {

        const res = await fetchAIModels()

        if (res.error || res.data === null || res.data.length === 0) {
            throw new Error(res.error ? res.error : "No Models available");
        }
        else {
            dispatch(setModels(res.data));
        }
    };
    const fetchPersona = async () => {

        const res = await fetchPersonas()

        if (res.error || res.data === null || res.data.length === 0) {
            throw new Error(res.error ? res.error : "No Peronas available");
        }
        else {
            dispatch(setPersonas(res.data));
        }
    };
    useEffect(() => {
        fetchPersona();
        fetchModels();
    }, [dispatch]);


    return {
        models,
        personas,
    };
};

export default usePersonasAI;