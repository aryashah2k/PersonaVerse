import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Persona } from '../../model/persona';
import { AIModel } from '../../model/AIModel';

interface PersonaAIState {
    personas: Persona[];
    models: AIModel[];
}

const initialState: PersonaAIState = {
    personas: [],
    models: [],
};

export const personaAISlice = createSlice({
    name: 'personaAI',
    initialState,
    reducers: {
        setPersonas: (state, action: PayloadAction<Persona[]>) => {
            state.personas = action.payload;
        },
        setModels: (state, action: PayloadAction<AIModel[]>) => {
            state.models = action.payload;
        },

        resetPersonaAIState: () => initialState,
    },
});

export const {
    setPersonas,
    setModels,
    resetPersonaAIState,
} = personaAISlice.actions;

export default personaAISlice.reducer;
export type { PersonaAIState }
