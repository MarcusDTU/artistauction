import {supabase} from "../dbConfig.js";

export const getAllBids = async () => {
    const {data, error} = await supabase
        .from('Bid')
        .select('*')
    return {data, error};
}
