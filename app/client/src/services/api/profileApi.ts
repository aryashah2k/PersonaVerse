
import Profile, { copyWith } from "../../model/profile"
import { ResponseWrapper } from "../../model/responseWrapper"
import { supabase } from "../../utils/supabase/supabase"

export async function fetchProfile(): Promise<ResponseWrapper<Profile>> {
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

    const { data, error } = await supabase.from('Profiles').select('*').eq('id', session.user.id)

    if (error) {
        return {
            data: null,
            error: error.message,
        }
    }
    const profile: Profile = copyWith(data[0])

    return {
        data: profile,
        error: null,
    }
}
