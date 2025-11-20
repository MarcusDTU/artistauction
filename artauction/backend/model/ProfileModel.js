import { supabase } from '../dbConfig.js';

export const getAllProfiles = async () => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*');
    return { data, error };
}

export const getProfileById = async (id) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
    return { data, error };
}

export const getAllArtists = async () => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'artist');
    return { data, error };
}