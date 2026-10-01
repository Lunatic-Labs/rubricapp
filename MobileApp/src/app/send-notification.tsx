import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { sendAdminNotification } from '@/api/notifications';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Primary, Spacing } from '@/constants/theme';
import { useApi } from '@/hooks/use-api';
import { useTheme } from '@/hooks/use-theme';

interface FieldErrors {
  subject: string;
  message: string;
}

export default function SendNotificationScreen() {
  const theme = useTheme();
  const request = useApi();

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({ subject: '', message: '' });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSend = async () => {
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    const newErrors: FieldErrors = {
      subject: trimmedSubject === '' ? 'Subject cannot be empty' : '',
      message: trimmedMessage === '' ? 'Message cannot be empty' : '',
    };

    if (newErrors.subject || newErrors.message) {
      setErrors(newErrors);
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);
    const result = await sendAdminNotification(request, trimmedSubject, trimmedMessage);
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
        <Stack.Screen options={{ title: 'Send New Message' }} />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedView type="backgroundElement" style={styles.card}>
            {errorMessage && (
              <ThemedText type="small" themeColor="error" style={styles.formError}>
                {errorMessage}
              </ThemedText>
            )}

            <ThemedText type="smallBold" style={styles.label}>
              Subject
            </ThemedText>
            <TextInput
              value={subject}
              onChangeText={(value) => {
                setSubject(value);
                setErrors((prev) => ({ ...prev, subject: '' }));
              }}
              aria-label="notificationSubjectInput"
              style={[styles.input, { color: theme.text, borderColor: errors.subject ? theme.error : theme.border }]}
            />
            {!!errors.subject && (
              <ThemedText type="small" themeColor="error">
                {errors.subject}
              </ThemedText>
            )}

            <ThemedText type="smallBold" style={styles.label}>
              Message
            </ThemedText>
            <TextInput
              value={message}
              onChangeText={(value) => {
                setMessage(value);
                setErrors((prev) => ({ ...prev, message: '' }));
              }}
              multiline
              numberOfLines={6}
              aria-label="notificationMessageInput"
              style={[
                styles.input,
                styles.messageInput,
                { color: theme.text, borderColor: errors.message ? theme.error : theme.border },
              ]}
            />
            {!!errors.message && (
              <ThemedText type="small" themeColor="error">
                {errors.message}
              </ThemedText>
            )}

            <View style={styles.actionRow}>
              <Pressable onPress={() => router.back()} style={styles.cancelButton} aria-label="cancelSendNotificationButton">
                <ThemedText type="smallBold">Cancel</ThemedText>
              </Pressable>
              <Pressable
                onPress={handleSend}
                disabled={isSubmitting}
                style={({ pressed }) => [
                  styles.sendButton,
                  { backgroundColor: Primary, opacity: pressed || isSubmitting ? 0.8 : 1 },
                ]}
                aria-label="sendNotificationButton">
                {isSubmitting ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <ThemedText type="smallBold" style={styles.sendLabel}>
                    Send
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
  messageInput: {
    minHeight: 120,
    textAlignVertical: 'top',
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
  sendButton: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendLabel: {
    color: '#ffffff',
  },
});
