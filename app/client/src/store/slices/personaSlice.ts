// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { Persona } from '../../model/persona';
// import { AIModel } from '../../model/AIModel';

// interface PersonaState {
//   personas: Persona[];
//   models: AIModel[];
//   responsePrompt: string;
//   generatedResponseUrl: string | null;
//   isSubmitting: boolean;
//   isSubmitted: boolean;
//   error: string | null;
// }

// const initialState: PersonaState = {
//   personas: [],
//   models: [],
//   responsePrompt: '',
//   generatedResponseUrl: null,
//   isSubmitting: false,
//   isSubmitted: false,
//   error: null,
// };

// export const personaSlice = createSlice({
//   name: 'persona',
//   initialState,
//   reducers: {
//     setPersonas: (state, action: PayloadAction<Persona[]>) => {
//       state.personas = action.payload;
//     },
//     setModels: (state, action: PayloadAction<AIModel[]>) => {
//       state.models = action.payload;
//     },
//     togglePersonaSelection: (state, action: PayloadAction<string>) => {
//       const personaId = action.payload;
//       const personaIndex = state.personas.findIndex((p) => p.id === personaId);

//       if (personaIndex !== -1) {
//         state.personas[personaIndex].selected = !state.personas[personaIndex].selected;
//       }
//     },
//     selectModel: (state, action: PayloadAction<string>) => {
//       const modelId = action.payload;
//       state.models = state.models.map((model) => ({
//         ...model,
//         selected: model.id === modelId,
//       }));
//     },
//     setResponsePrompt: (state, action: PayloadAction<string>) => {
//       state.responsePrompt = action.payload;
//     },
//     submitStart: (state) => {
//       state.isSubmitting = true;
//       state.isSubmitted = false;
//       state.error = null;
//     },
//     submitSuccess: (state, action: PayloadAction<string>) => {
//       state.isSubmitting = false;
//       state.isSubmitted = true;
//       state.generatedResponseUrl = action.payload;
//     },
//     submitFailure: (state, action: PayloadAction<string>) => {
//       state.isSubmitting = false;
//       state.error = action.payload;
//     },
//     resetPersonaState: () => initialState,
//   },
// });

// export const {
//   setPersonas,
//   setModels,
//   togglePersonaSelection,
//   selectModel,
//   setResponsePrompt,
//   submitStart,
//   submitSuccess,
//   submitFailure,
//   resetPersonaState,
// } = personaSlice.actions;

// export default personaSlice.reducer;
