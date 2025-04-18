import { supabase } from "../utils/supabase/supabase";

type LoginParams = {
    email: string;
    password: string;
};

type SignUpParams = {
    name: string;
    username: string;
    email: string;
    password: string;
}

export const authService = {
    login: async ({ email, password, }: LoginParams) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (data?.user && data?.session) {
            // Store in localStorage to persist session
            localStorage.setItem('personaverse_current_user', JSON.stringify(data.user));
            localStorage.setItem('personaverse_current_session', JSON.stringify(data.session));
            return data.user;
        }
        else {
            throw new Error('Invalid email or password');
        }
    },


    register: async ({ name, username, email, password }: SignUpParams) => {

        let { data, error } = await supabase.auth.signUp({
            email: name,
            password: password,
        })
        if (data?.user && data?.session) {
            // Store in localStorage to persist session
            localStorage.setItem('personaverse_current_user', JSON.stringify(data.user));
            localStorage.setItem('personaverse_current_session', JSON.stringify(data.session));
            return data.user;
        }
        else {
            throw new Error('Something went wrong during registration');
        }
    },

    logout: async () => {
        let { error } = await supabase.auth.signOut()
        // Remove from localStorage
        localStorage.removeItem('personaverse_current_user');
        localStorage.removeItem('personaverse_current_session');

        return true;
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('personaverse_current_user');
        return user ? JSON.parse(user) : null;
    },
};