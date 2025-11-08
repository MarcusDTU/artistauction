import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

function createMockSupabase() {
  const noop = () => {};
  const ok = (data = null) => ({ data, error: null });
  const auth = {
    async signInWithPassword() { return ok({ user: null, session: null }); },
    async signUp() { return ok({ user: { id: 'test-user' }, session: null }); },
    async signOut() { return ok(); },
    async getSession() { return ok({ session: null }); },
    onAuthStateChange() {
      return { data: { subscription: { unsubscribe: noop } } };
    },
  };
  const from = () => ({
    async select() { return ok([]); },
    async update() { return ok({}); },
    eq() { return this; },
    single() { return ok({}); },
  });
  return { auth, from };
}

let supabaseClient;
if (process.env.NODE_ENV === 'test') {
  supabaseClient = createMockSupabase();
} else if (supabaseUrl && supabaseAnonKey) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Non-fatal warning to help local setup and avoid crashes in dev without env
  // eslint-disable-next-line no-console
  console.warn('Supabase env vars missing. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY.');
  supabaseClient = createMockSupabase();
}

export const supabase = supabaseClient;
export default supabaseClient;
