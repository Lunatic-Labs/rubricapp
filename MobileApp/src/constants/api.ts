/**
 * `127.0.0.1` resolves to the phone/simulator itself, not your dev machine —
 * set EXPO_PUBLIC_API_URL in MobileApp/.env to your machine's LAN IP
 * (e.g. http://192.168.1.42:5000/api) to reach a locally running Flask backend.
 */
export const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? 'http://127.0.0.1:5000/api';
