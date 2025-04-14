// import { useCallback, useMemo } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../store';
// import {
//   togglePersonaSelection,
//   selectModel,
//   setResponsePrompt,
//   submitStart,
//   submitSuccess,
//   submitFailure,
//   setPersonas,
//   setModels,
// } from '../store/slices/personaSlice';
// import { personaService } from '../services/api';
// import { deductTokens } from '../store/slices/userSlice';
// import { Persona } from '../model/persona';
// import { AIModel } from '../model/AIModel';

// export const usePersonaSelection = () => {
//   const dispatch = useDispatch();
//   const { personas, models, responsePrompt, isSubmitting, error } = useSelector(
//     (state: RootState) => state.persona
//   );
//   const { profile } = useSelector((state: RootState) => state.user);

//   const selectedPersonas = useMemo(() => personas.filter((p) => p.selected), [personas]);
//   const selectedModel = useMemo(() => models.find((m) => m.selected), [models]);

//   const estimatedTokenCost = useMemo(() => {
//     if (!selectedModel) return 0;
//     return selectedModel.tokenCost * selectedPersonas.length;
//   }, [selectedModel, selectedPersonas]);

//   const hasSelectedPersona = useMemo(() => selectedPersonas.length > 0, [selectedPersonas]);
//   const hasSelectedModel = useMemo(() => !!selectedModel, [selectedModel]);
//   const hasEnoughTokens = useMemo(
//     () => (profile?.tokensAvailable || 0) >= estimatedTokenCost,
//     [profile, estimatedTokenCost]
//   );

//   const togglePersona = useCallback(
//     (personaId: string) => {
//       dispatch(togglePersonaSelection(personaId));
//     },
//     [dispatch]
//   );

//   const selectAIModel = useCallback(
//     (modelId: string) => {
//       dispatch(selectModel(modelId));
//     },
//     [dispatch]
//   );

//   const updateResponsePrompt = useCallback(
//     (prompt: string) => {
//       dispatch(setResponsePrompt(prompt));
//     },
//     [dispatch]
//   );

//   const setPersonasList = useCallback(
//     (personasList: Persona[]) => {
//       dispatch(setPersonas(personasList));
//     },
//     [dispatch]
//   );

//   const setModelsList = useCallback(
//     (modelsList: AIModel[]) => {
//       dispatch(setModels(modelsList));
//     },
//     [dispatch]
//   );

//   const generateResponses = useCallback(
//     async (fileUrl: string) => {
//       if (!selectedModel || selectedPersonas.length === 0 || !responsePrompt) {
//         return { success: false, error: 'Missing required fields' };
//       }

//       if (!hasEnoughTokens) {
//         return { success: false, error: 'Insufficient tokens' };
//       }

//       dispatch(submitStart());

//       try {
//         const result = await personaService.generateResponses(
//           fileUrl,
//           selectedModel.id,
//           selectedPersonas.map((p) => p.id),
//           responsePrompt
//         );

//         // Deduct tokens
//         dispatch(deductTokens(result.tokenCost));

//         dispatch(submitSuccess(result.responseUrl));
//         return { success: true, responseUrl: result.responseUrl };
//       } catch (error) {
//         const errorMessage = error instanceof Error ? error.message : 'Failed to generate responses';
//         dispatch(submitFailure(errorMessage));
//         return { success: false, error: errorMessage };
//       }
//     },
//     [
//       dispatch,
//       selectedModel,
//       selectedPersonas,
//       responsePrompt,
//       hasEnoughTokens,
//     ]
//   );

//   return {
//     personas,
//     models,
//     selectedPersonas,
//     selectedModel,
//     responsePrompt,
//     isSubmitting,
//     error,
//     estimatedTokenCost,
//     hasSelectedPersona,
//     hasSelectedModel,
//     hasEnoughTokens,
//     togglePersona,
//     selectAIModel,
//     updateResponsePrompt,
//     generateResponses,
//     setPersonas: setPersonasList,
//     setModels: setModelsList,
//   };
// };

// export default usePersonaSelection;
