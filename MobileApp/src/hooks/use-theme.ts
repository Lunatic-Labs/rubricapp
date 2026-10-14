import { Colors } from '@/constants/theme';

/**
 * Always the light (blue/white) palette — the app intentionally does not follow
 * the OS dark mode setting, to keep branding consistent with the desktop web app.
 */
export function useTheme() {
  return Colors.light;
}
