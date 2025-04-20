import { AIModel, copyWith as aiCopyWith } from "../../model/AIModel";
import { copyWith as personaCopyWith, Persona } from "../../model/persona";
import { ResponseWrapper } from "../../model/responseWrapper";
import { supabase } from "../../utils/supabase/supabase";

export async function fetchAIModels(): Promise<ResponseWrapper<AIModel[]>> {

    const { data, error } = await supabase.from('Models').select('*').order('id')

    if (error || data.length === 0) {
        return {
            data: null,
            error: error ? error.message : "No Models available",
        }
    }
    const models: AIModel[] = data.map((item: any) => (aiCopyWith(item)))
    return {
        data: models,
        error: null,
    }
}

export async function fetchPersonas(): Promise<ResponseWrapper<Persona[]>> {

    const { data, error } = await supabase.from('Personas').select('*').order('id')

    if (error || data.length === 0) {
        return {
            data: null,
            error: error ? error.message : "No Personas available",
        }
    }
    const personas: Persona[] = data.map((item: any) => (personaCopyWith(item)))
    return {
        data: personas,
        error: null,
    }
}