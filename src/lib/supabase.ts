import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase URL and anon key
const supabaseUrl = 'https://qikcaqpjikptizgaiwbi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpa2NhcXBqaWtwdGl6Z2Fpd2JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMTg2NTIsImV4cCI6MjA1OTU5NDY1Mn0.EtLIMp9hkahF8TWX8DL3JAzNYSId18ZllOfv9eDAf_s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
