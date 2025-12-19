
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database' // Ideally we would generate types, but we'll use 'any' or basic types for now if not present

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase Environment Variables')
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey)
