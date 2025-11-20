import { supabase } from '../dbConfig.js';

export const getAllProfiles = async () => {
    const { data, error } = await supabase
        .from('Profile')
        .select('*');
    return { data, error };
}

export const getProfileById = async (id) => {
    const { data, error } = await supabase
        .from('Profile')
        .select('*')
        .eq('id', id)
        .single();
    return { data, error };
}