import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  type TextInput as TextInputType,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { login } from '@/api/auth';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MAX_PASSWORD_LENGTH } from '@/constants/password';
import { MaxContentWidth, Primary, Spacing } from '@/constants/theme';
import { useSession } from '@/context/session';
import { useTheme } from '@/hooks/use-theme';

interface FieldErrors {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const theme = useTheme();
  const { signIn } = useSession();
  const passwordInputRef = useRef<TextInputType>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (trimmedEmail === '' || trimmedPassword === '') {
      setErrors({
        email: trimmedEmail === '' ? 'Email cannot be empty' : '',
        password: trimmedPassword === '' ? 'Password cannot be empty' : '',
      });
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (!result.ok) {
      setErrorMessage(result.errorMessage);
      return;
    }

    await signIn(result.session);
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ThemedView style={styles.flex}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedText
            type="title"
            style={[styles.brand, { color: Primary }]}
            aria-label="SkillBuilder">
            SkillBuilder
          </ThemedText>

          <ThemedView type="backgroundElement" style={styles.card}>
            {errorMessage && (
              <ThemedText type="small" themeColor="error" style={styles.formError}>
                {errorMessage}
              </ThemedText>
            )}

            <ThemedText type="smallBold" style={styles.label}>
              Email Address
            </ThemedText>
            <TextInput
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                setErrors((prev) => ({ ...prev, email: '' }));
              }}
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              autoCapitalize="none"
              autoComplete="email"
              textContentType="username"
              keyboardType="email-address"
              returnKeyType="next"
              submitBehavior="submit"
              aria-label="emailInput"
              style={[
                styles.input,
                {
                  color: theme.text,
                  borderColor: errors.email ? theme.error : theme.border,
                },
              ]}
              placeholderTextColor={theme.textSecondary}
            />
            {!!errors.email && (
              <ThemedText type="small" themeColor="error">
                {errors.email}
              </ThemedText>
            )}

            <ThemedText type="smallBold" style={styles.label}>
              Password
            </ThemedText>
            <View style={styles.passwordRow}>
              <TextInput
                ref={passwordInputRef}
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  setErrors((prev) => ({ ...prev, password: '' }));
                }}
                onSubmitEditing={handleSubmit}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="current-password"
                textContentType="password"
                maxLength={MAX_PASSWORD_LENGTH + 1}
                returnKeyType="done"
                aria-label="passwordInput"
                style={[
                  styles.input,
                  styles.passwordInput,
                  {
                    color: theme.text,
                    borderColor: errors.password ? theme.error : theme.border,
                  },
                ]}
                placeholderTextColor={theme.textSecondary}
              />
              <Pressable
                onPress={() => setShowPassword((prev) => !prev)}
                style={styles.eyeButton}
                aria-label="toggle password visibility">
                <SymbolView
                  name={{
                    ios: showPassword ? 'eye' : 'eye.slash',
                    android: showPassword ? 'visibility' : 'visibility_off',
                    web: showPassword ? 'visibility' : 'visibility_off',
                  }}
                  tintColor={theme.textSecondary}
                  size={20}
                />
              </Pressable>
            </View>
            {!!errors.password && (
              <ThemedText type="small" themeColor="error">
                {errors.password}
              </ThemedText>
            )}

            <Pressable
              onPress={handleSubmit}
              disabled={isSubmitting}
              aria-label="loginButton"
              style={({ pressed }) => [
                styles.submitButton,
                { backgroundColor: Primary, opacity: pressed || isSubmitting ? 0.8 : 1 },
              ]}>
              {isSubmitting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <ThemedText type="smallBold" style={styles.submitLabel}>
                  Sign In
                </ThemedText>
              )}
            </Pressable>
          </ThemedView>
        </SafeAreaView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
  },
  brand: {
    fontSize: 28,
    marginBottom: Spacing.five,
  },
  card: {
    width: '100%',
    maxWidth: MaxContentWidth / 2,
    borderRadius: Spacing.three,
    padding: Spacing.four,
    gap: Spacing.one,
  },
  formError: {
    marginBottom: Spacing.two,
  },
  label: {
    marginTop: Spacing.two,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
  },
  eyeButton: {
    position: 'absolute',
    right: Spacing.three,
    padding: Spacing.one,
  },
  submitButton: {
    marginTop: Spacing.four,
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitLabel: {
    color: '#ffffff',
  },
});
