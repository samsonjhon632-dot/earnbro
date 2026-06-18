// This file is deprecated. Use the real auth hook instead:
// import { useAuth } from "@/hooks/use-auth";
//
// The real auth hook provides:
// - user: authenticated user object or null
// - loading: boolean indicating if auth is being checked
// - isAuthenticated: boolean
// - logout: async function to logout
// - refresh: async function to refresh user data
//
// The real authentication uses Manus OAuth with:
// - Web: HTTP-only cookies
// - Native: Secure token storage via expo-secure-store

export { useAuth } from "@/hooks/use-auth";
