/**
 * App Entry — Redirect to auth or home based on auth state
 */

import { Redirect } from 'expo-router';

export default function Index() {
  // For now, always redirect to the auth flow
  // Later: check useAuthStore().isAuthenticated
  return <Redirect href="/(auth)/onboarding" />;
}
