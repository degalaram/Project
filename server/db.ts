import { createClient } from '@supabase/supabase-js';
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { config } from "dotenv";
import { users, companies, jobs, applications, contacts, courses } from "@shared/schema";

config();

// Use Supabase instead of Neon
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const databaseUrl = process.env.DATABASE_URL || '';

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to configure Supabase database?",
  );
}

// Create Supabase client for additional features if needed
export const supabase = createClient(supabaseUrl, supabaseKey);

// Create postgres connection for Drizzle ORM
const queryClient = postgres(databaseUrl, { prepare: false });
export const db = drizzle(queryClient, { schema: {
  users,
  companies,
  jobs,
  applications,
  contacts,
  courses,
} });
