import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase = null

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables. Save/Load and image upload will not work.')
} else {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export { supabase }
