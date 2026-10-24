import Constants from 'expo-constants';
import { Platform } from 'react-native';

const BACKEND_PORT = 5050;
const IPV4_PATTERN = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;

/**
 * Derives the backend host from wherever Expo Go actually connected to Metro
 * (Constants.expoConfig.hostUri, e.g. "10.51.66.158:8081") instead of a
 * hardcoded LAN IP in .env — so this doesn't need updating every time you
 * switch Wi-Fi networks.
 *
 * Only valid in LAN mode: in tunnel mode, hostUri points at Expo's relay
 * hostname (not your machine), so we only trust it when it's a plain IPv4
 * address — anything else falls back to EXPO_PUBLIC_API_URL.
 */
function detectLanDevServerHost(): string | null {
  const hostUri = Constants.expoConfig?.hostUri;
  const host = hostUri?.split(':')[0];
  return host && IPV4_PATTERN.test(host) ? host : null;
}

const detectedHost = Platform.OS !== 'web' ? detectLanDevServerHost() : null;

export const apiUrl = detectedHost
  ? `http://${detectedHost}:${BACKEND_PORT}/api`
  : (process.env.EXPO_PUBLIC_API_URL ?? `http://127.0.0.1:${BACKEND_PORT}/api`);
