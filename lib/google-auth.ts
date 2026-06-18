import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

// Configure web browser for OAuth
WebBrowser.maybeCompleteAuthSession();

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

/**
 * Open Google Sign-In in web browser
 */
export async function signInWithGoogle(): Promise<GoogleUser | null> {
  try {
    const redirectUrl = Platform.select({
      web: 'http://localhost:3000/auth/google/callback',
      default: 'earnbro://auth/google/callback',
    });

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
      client_id: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '',
      redirect_uri: redirectUrl,
      response_type: 'code',
      scope: 'openid profile email',
      access_type: 'offline',
    }).toString()}`;

    const result = await WebBrowser.openAuthSessionAsync(googleAuthUrl, redirectUrl);

    if (result.type === 'success' && result.url) {
      // Extract code from redirect URL
      const url = new URL(result.url);
      const code = url.searchParams.get('code');

      if (code) {
        // Exchange code for user info (would be done on backend in production)
        return await mockGoogleUser();
      }
    }

    return null;
  } catch (error) {
    console.error('Google Sign-In error:', error);
    return null;
  }
}

/**
 * Mock Google user for development/testing
 */
export async function mockGoogleUser(): Promise<GoogleUser> {
  return {
    id: 'google_' + Math.random().toString(36).substr(2, 9),
    email: 'user@gmail.com',
    name: 'Google User',
    picture: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
  };
}

/**
 * Sign out from Google
 */
export async function signOutGoogle(): Promise<void> {
  try {
    // In production, would revoke token on backend
    console.log('Signed out from Google');
  } catch (error) {
    console.error('Google Sign-Out error:', error);
  }
}
