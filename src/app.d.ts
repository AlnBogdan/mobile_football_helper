// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
/// <reference types="@sveltejs/kit" />

import { SupabaseClient, Session } from '@supabase/supabase-js';
import type { AppUser } from '$lib/types';
declare global {
	namespace App {
		interface Locals {
		  supabase: SupabaseClient;
		  getSession: () => Promise<Session | null>;
		  getUser: () => Promise<AppUser | null>;
		}
		interface PageData {
		  session?: Session | null;
		  user?: AppUser | null;
		}
		// interface Error {}
		// interface Platform {}
	  }
}



export {};
