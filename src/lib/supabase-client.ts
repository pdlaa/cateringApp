import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'

export function createClient() {
  return createBrowserClient<Database>(
    'https://gsnqqagodywgfvrsohhl.supabase.co',  // ← Tempel URL-mu di sini
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzbnFxYWdvZHl3Z2Z2cnNvaGhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1MTM2MDIsImV4cCI6MjA5MzA4OTYwMn0.Gtw1UHas3-mdF2mDP-j77hkAHXAIM7A972kf1Me5wUI'       // ← Tempel anon key-mu di sini
  )
}