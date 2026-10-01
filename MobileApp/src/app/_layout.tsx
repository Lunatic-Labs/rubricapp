import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { SessionProvider, useSession } from '@/context/session';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <SessionProvider>
      <RootNavigator />
    </SessionProvider>
  );
}

function RootNavigator() {
  const { isLoading, session } = useSession();

  if (isLoading) {
    return null;
  }

  return (
    // Always the light theme — branding stays blue/white regardless of OS dark mode.
    <ThemeProvider value={DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!!session}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="user-courses" options={{ headerShown: true }} />
          <Stack.Screen name="edit-user" options={{ headerShown: true }} />
          <Stack.Screen name="send-notification" options={{ headerShown: true }} />
          <Stack.Screen name="add-user" options={{ headerShown: true }} />
          <Stack.Screen name="course-assessment-tasks" options={{ headerShown: true }} />
        </Stack.Protected>

        <Stack.Protected guard={!session}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}
