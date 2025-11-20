import 'dotenv/config';
import {createClient} from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseClient = createClient(
    supabaseUrl,
    supabaseAnonKey
)

export const supabase = supabaseClient;