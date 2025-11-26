import { supabase } from '../dbConfig.js';

export const getAllArtists = async () => {
    const { data, error } = await supabase
        .from('Artist')
        .select('*');
    return { data, error };
}

export const getArtistByNumber = async (artist_number) => {
    const { data, error } = await supabase
        .from('Artist')
        .select('*')
        .eq('artist_id', artist_number)
        .single();
    return { data, error };
}

export const getArtistByEmail = async (email) => {
    const { data, error } = await supabase
        .from('Artist')
        .select('*')
        .eq('email', email)
        .single();
    return { data, error };
}