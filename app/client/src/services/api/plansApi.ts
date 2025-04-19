import { ResponseWrapper } from "../../model/responseWrapper";
import Subscription, { copyWith } from "../../model/subscription";
import { supabase } from "../../utils/supabase/supabase";

export async function fetchSubscriptionPlans(): Promise<ResponseWrapper<Subscription[]>> {
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

    const { data, error } = await supabase.from('Plans').select('*').order('display_order')

    if (error || data.length === 0) {
        return {
            data: null,
            error: error ? error.message : "No plans available",
        }
    }
    const plans: Subscription[] = data.map((item: any) => (copyWith(item)))

    return {
        data: plans,
        error: null,
    }
}