import dotenv from 'dotenv';
import {createClient} from "@supabase/supabase-js";

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Missing required environment variables:');
    console.error('SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
    console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceRoleKey ? 'Set' : 'Missing');
    console.error('Please create a .env file with these variables. See .env.example for reference.');
    process.exit(1);
}

const supabaseClient = createClient(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
)

export const supabase = supabaseClient;