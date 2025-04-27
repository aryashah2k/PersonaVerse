import { ResponseWrapper } from "../../model/responseWrapper"
import { copyWith } from "../../model/surveyHistory"
import { supabase } from "../../utils/supabase/supabase"
import { BackendRoutes } from "./utils/backendRoutes"

type fnParams = {
    model_id: string | undefined,
    instructions: string,
    personaDescriptions: string[],
    responseInJson?: boolean,
    file: File | null,
}
export async function getResponse({ file, model_id, instructions, personaDescriptions, responseInJson = false }: fnParams): Promise<ResponseWrapper<any>> {

    if (!file) {
        return {
            data: null,
            error: 'File is not provided',
        }
    }
    if (!model_id) {
        return {
            data: null,
            error: "Select a model",
        }
    }

    const {
        data: { session },
        error: sessionError,
    } = await supabase.auth.getSession()

    if (!session || sessionError) {
        return {
            data: null,
            error: 'User is not authenticated',
        }
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("model_id", model_id.toString())
    formData.append("instructions", instructions)
    formData.append("personas", JSON.stringify(personaDescriptions))
    formData.append("response_in_json", responseInJson.toString())
    formData.append("is_from_survey", "true")

    const res = await fetch(BackendRoutes.FILL_SURVEY, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": import.meta.env.VITE_OCP_APIM_SUBSCRIPTION_KEY,
            'Authorization': `Bearer ${session.access_token}`
        },
        body: formData,
    })
    console.log("response", res);
    console.log("API response:", await res.json());
    if (res.ok) {
        const data = await res.json()
        const p = copyWith(data)
        console.log("converted data", p)
    }
    else {

        const error = await res.json()
        return {
            data: null,
            error: error.error,
        }
    }

    return {
        data: null,
        error: null,
    }
}

type SignedURLParams = {
    storagePath: string;
}
export async function getSignedURL({ storagePath }: SignedURLParams): Promise<ResponseWrapper<string>> {

    const { data, error } = await supabase.functions.invoke('smooth-endpoint', {
        body: { storagePath, expirationTime: 600 },
    })
    if (error) {
        return {
            data: null,
            error: error.message,
        }
    }
    return {
        data: data.signedUrl,
        error: null,
    }
}