// import { supabase } from '../utils/supabase/supabase';
// import { ResponseWrapper } from '../model/responseWrapper';
// import Profile from '../model/profile';
// import { fetchProfile } from './profileApi';

// type LoginParams = {
//     email: string;
//     password: string;
// };


// export async function loginWithEmail({ email, password, }: LoginParams): Promise<ResponseWrapper<Profile>> {
//     const { data, error } = await supabase.auth.signInWithPassword({ email, password });

//     if (error) {
//         return {
//             data: null,
//             error: error.message,
//         };
//     }

//     if (data?.user && data?.session) {
//         const profile = await fetchProfile();
//         if (profile.error || profile.data === null) {
//             return {
//                 data: null,
//                 error: profile.error || 'Set your profile',
//             };
//         }
//         return {
//             data: profile.data,
//             error: null,
//         }
//     }

//     return {
//         data: null,
//         error: 'Unknown error occurred during login.',
//     };
// }

