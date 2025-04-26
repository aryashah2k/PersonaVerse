import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Persona } from '../../model/persona';
import { AIModel } from '../../model/AIModel';

interface FormState {
    personas: Persona[];
    model: AIModel | null;
    instruction: string;
    responseInJson: boolean;
    isSubmitting: boolean;
    isSubmitted: boolean;
    error: string | null;
}

const initialState: FormState = {
    personas: [],
    model: null,
    instruction: '',
    responseInJson: false,
    isSubmitting: false,
    isSubmitted: false,
    error: null,
};

export const formSlice = createSlice({
    name: 'form',
    initialState,
    reducers: {
        setPersona: (state, action: PayloadAction<Persona>) => {
            const personas: Persona[] = state.personas;
            if (personas.findIndex((persona) => persona.id === action.payload.id) === -1) {
                personas.push(action.payload);
                state.personas = personas;
            }
            else {
                state.personas = personas.filter((persona) => persona.id !== action.payload.id);
            }
        },
        setModel: (state, action: PayloadAction<AIModel>) => {
            state.model = action.payload;
        },
        setInstruction: (state, action: PayloadAction<string>) => {
            state.instruction = action.payload;
        },
        setFileOutput: (state, action: PayloadAction<boolean>) => {
            state.responseInJson = action.payload;
        },
        submitStart: (state) => {
            state.isSubmitting = true;
            state.isSubmitted = false;
            state.error = null;
        },
        submitSuccess: (state) => {
            state.isSubmitting = false;
            state.isSubmitted = true;
        },
        submitFailure: (state, action: PayloadAction<string>) => {
            state.isSubmitting = false;
            state.error = action.payload;
        },
        resetFormState: () => initialState,
    },
});

export const {
    setPersona,
    setModel,
    setInstruction,
    setFileOutput,
    submitStart,
    submitSuccess,
    submitFailure,
    resetFormState,
} = formSlice.actions;

export default formSlice.reducer;
export type { FormState };
