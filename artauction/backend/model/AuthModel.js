import { supabase } from '../dbConfig.js';

export const signUp = async (email, password, metadata) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: metadata,
            emailRedirectTo: 'http://localhost:3000/#/login'
        }
    });
    return { data, error };
}

export const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    return { data, error };
}

export const updatePassword = async (accessToken, refreshToken, newPassword) => {
    // Set the session first
    const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
    });

    if (sessionError) return { error: sessionError };

    // Update the user
    const { data, error } = await supabase.auth.updateUser({
        password: newPassword
    });

    return { data, error };
}

export const requestPasswordReset = async (email, redirectTo) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo || 'http://localhost:3000/#/reset'
    });
    return { data, error };
}

export const createProfile = async (profileData) => {
    const { data, error } = await supabase
        .from('Profile')
        .upsert([profileData], { onConflict: 'email' })
        .select()
        .single();
    return { data, error };
}

export const getProfileByEmail = async (email) => {
    const { data, error } = await supabase
        .from('Profile')
        .select('*')
        .eq('email', email)
        .single();
    return { data, error };
}
