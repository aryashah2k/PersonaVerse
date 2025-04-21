import { ResponseWrapper } from "../../model/responseWrapper"
import { supabase } from "../../utils/supabase/supabase"
import { BackendRoutes } from "./utils/backendRoutes"

type fnParams = {
    model_name: string,
    instructions: string,
    personaDescriptions: string[],
    responseInJson?: boolean,
}
export async function getResponse({ model_name, instructions, personaDescriptions, responseInJson = false }: fnParams): Promise<ResponseWrapper<any>> {

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

    const res = await fetch(BackendRoutes.DEMO, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            questions: [
                "How would you rate the overall quality of education in your country in Asia?",
                "How accessible do you think higher education is for students in rural areas of your country?",
                "How satisfied are you with the integration of technology in classrooms across Asia?",
                "How effective do you believe the current education system is in preparing students for the job market?",
                "How well do schools in Asia promote creativity and critical thinking?",
                "How would you rate the importance given to mental health support in schools and universities in Asia?",
                "How do you perceive the role of private vs public education in terms of quality in your country?",
                "How equitable do you find access to quality education among different socio-economic groups in Asia?",
                "How much emphasis do you think is placed on rote memorization in the Asian education system?",
                "How optimistic are you about the future improvements in the education system in Asia over the next decade?",
            ],
            model_name: model_name,
            instructions: instructions,
            personas: personaDescriptions,
            responseInJson: responseInJson,
        }),
    })

    console.log("API response:", await res.json());


    return {
        data: null,
        error: null,
    }
}
