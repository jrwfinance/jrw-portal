import { createClient } from '@supabase/supabase-js'

const SUPA_URL = 'https://amhevyrewmlmwxncujmp.supabase.co'
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtaGV2eXJld21sbXd4bmN1am1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1NTI4MjQsImV4cCI6MjA5MjEyODgyNH0._I0pevBOVM7YMKPRkKTKiYVCUyAkAkYPr0ZzfW4qlt0'

export const supabase = createClient(SUPA_URL, SUPA_KEY)
