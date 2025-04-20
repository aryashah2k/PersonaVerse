import { ResponseWrapper } from "../../model/responseWrapper";
import SurveyHistory, { copyWith as historyCopyWith } from "../../model/surveyHistory";
import { supabase } from "../../utils/supabase/supabase";

export async function fetchSurveyHistory(): Promise<ResponseWrapper<SurveyHistory[]>> {

    const { data, error } = await supabase.from('SurveyHistory').select('*').order('created_at', { ascending: false })

    if (error || data.length === 0) {
        return {
            data: [],
            error: null
        }
    }
    const personas: SurveyHistory[] = data.map((item: any) => (historyCopyWith(item)))
    return {
        data: personas,
        error: null,
    }
}