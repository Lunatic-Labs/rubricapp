import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { createUser } from '@/api/users';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Primary, Spacing } from '@/constants/theme';
import { useSession } from '@/context/session';
import { useApi } from '@/hooks/use-api';
import { useTheme } from '@/hooks/use-theme';

const MAX_LMS_ID_LENGTH = 10;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FieldErrors {
  firstName: string;
  lastName: string;
  email: string;
  lmsId: string;
}

export default function AddUserScreen() {
  const theme = useTheme();
  const { session } = useSession();
  const request = useApi();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [lmsId, setLmsId] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({ firstName: '', lastName: '', email: '', lmsId: '' });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLmsIdChange = (value: string) => {
    if (value !== '' && !/^\d*$/.test(value)) {
      setErrors((prev) => ({ ...prev, lmsId: 'LMS ID can only contain numbers.' }));
      return;
    }
    if (value.length > MAX_LMS_ID_LENGTH) {
      setErrors((prev) => ({ ...prev, lmsId: `Max ${MAX_LMS_ID_LENGTH} digits.` }));
      return;
    }
    setLmsId(value);
    setErrors((prev) => ({ ...prev, lmsId: '' }));
  };

  const handleSubmit = async () => {
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const trimmedEmail = email.trim();

    const newErrors: FieldErrors = {
      firstName: trimmedFirst === '' ? 'First name cannot be empty' : '',
      lastName: trimmedLast === '' ? 'Last name cannot be empty' : '',
      email:
        trimmedEmail === ''
          ? 'Email cannot be empty'
          : !EMAIL_PATTERN.test(trimmedEmail)
            ? 'Please enter a valid email address'
            : '',
      lmsId: errors.lmsId,
    };

    if (newErrors.firstName || newErrors.lastName || newErrors.email || newErrors.lmsId) {
      setErrors(newErrors);
      return;
    }

    if (!session) return;

    setErrorMessage(null);
    setIsSubmitting(true);
    const result = await createUser(request, session.user.user_id, {
      firstName: trimmedFirst,
      lastName: trimmedLast,
      email: trimmedEmail,
      lmsId: lmsId !== '' ? lmsId : null,
    });
    setIsSubmitting(false);

    if (!result.ok) {
      setErrorMessage(result.errorMessage);
      return;
    }

    router.back();
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ThemedView style={styles.flex}>
        <Stack.Screen options={{ title: 'Add User' }} />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedView type="backgroundElement" style={styles.card}>
            {errorMessage && (
              <ThemedText type="small" themeColor="error" style={styles.formError}>
                {errorMessage}
              </ThemedText>
            )}

            <ThemedText type="smallBold" style={styles.label}>
              First Name
            </ThemedText>
            <TextInput
              value={firstName}
              onChangeText={(value) => {
                setFirstName(value);
                setErrors((prev) => ({ ...prev, firstName: '' }));
              }}
              aria-label="userFirstNameInput"
              style={[styles.input, { color: theme.text, borderColor: errors.firstName ? theme.error : theme.border }]}
            />
            {!!errors.firstName && (
              <ThemedText type="small" themeColor="error">
                {errors.firstName}
              </ThemedText>
            )}

            <ThemedText type="smallBold" style={styles.label}>
              Last Name
            </ThemedText>
            <TextInput
              value={lastName}
              onChangeText={(value) => {
                setLastName(value);
                setErrors((prev) => ({ ...prev, lastName: '' }));
              }}
              aria-label="userLastNameInput"
              style={[styles.input, { color: theme.text, borderColor: errors.lastName ? theme.error : theme.border }]}
            />
            {!!errors.lastName && (
              <ThemedText type="small" themeColor="error">
                {errors.lastName}
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
              autoCapitalize="none"
              keyboardType="email-address"
              aria-label="userEmailAddressInput"
              style={[styles.input, { color: theme.text, borderColor: errors.email ? theme.error : theme.border }]}
            />
            {!!errors.email && (
              <ThemedText type="small" themeColor="error">
                {errors.email}
              </ThemedText>
            )}

            <ThemedText type="smallBold" style={styles.label}>
              LMS ID (Optional)
            </ThemedText>
            <TextInput
              value={lmsId}
              onChangeText={handleLmsIdChange}
              keyboardType="number-pad"
              maxLength={MAX_LMS_ID_LENGTH}
              aria-label="userLmsIdInput"
              style={[styles.input, { color: theme.text, borderColor: errors.lmsId ? theme.error : theme.border }]}
            />
            {!!errors.lmsId && (
              <ThemedText type="small" themeColor="error">
                {errors.lmsId}
              </ThemedText>
            )}

            <View style={styles.actionRow}>
              <Pressable onPress={() => router.back()} style={styles.cancelButton} aria-label="cancelAddUserButton">
                <ThemedText type="smallBold">Cancel</ThemedText>
              </Pressable>
              <Pressable
                onPress={handleSubmit}
                disabled={isSubmitting}
                style={({ pressed }) => [
                  styles.submitButton,
                  { backgroundColor: Primary, opacity: pressed || isSubmitting ? 0.8 : 1 },
                ]}
                aria-label="addUserSubmitButton">
                {isSubmitting ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <ThemedText type="smallBold" style={styles.submitLabel}>
                    Add User
                  </ThemedText>
                )}
              </Pressable>
            </View>
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.four,
  },
  card: {
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
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.three,
    marginTop: Spacing.four,
  },
  cancelButton: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
  },
  submitButton: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitLabel: {
    color: '#ffffff',
  },
});
