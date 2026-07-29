"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

const DEFAULT_URL = "https://placeholder.supabase.co";
const DEFAULT_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2NjEzODEsImV4cCI6MjA5OTIzNzM4MX0.placeholder";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_KEY;

  return createBrowserClient(url, key);
}