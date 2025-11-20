import 'dotenv/config';
import {createClient} from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseClient = createClient(
    supabaseUrl,
    supabaseServiceRoleKey
)

export const supabase = supabaseClient;