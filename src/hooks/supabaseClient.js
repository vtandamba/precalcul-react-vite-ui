import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_KEY
  );
  
  const token = import.meta.env.VITE_KV_IMPORT_TOKEN;
  
export default supabase;
