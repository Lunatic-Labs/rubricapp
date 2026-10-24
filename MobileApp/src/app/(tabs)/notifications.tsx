import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type AdminNotification, deleteAdminNotification, listAdminNotifications } from '@/api/notifications';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Primary, Spacing } from '@/constants/theme';
import { useSession } from '@/context/session';
import { useApi } from '@/hooks/use-api';
import { useTheme } from '@/hooks/use-theme';

export default function NotificationsScreen() {
  const theme = useTheme();
  const { session } = useSession();
  const request = useApi();

  const [notifications, setNotifications] = useState<AdminNotification[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const load = useCallback(async () => {
    const result = await listAdminNotifications(request, !!session?.user.isSuperAdmin);
    if (result.ok) {
      setNotifications(result.data);
      setErrorMessage(null);
    } else {
      setErrorMessage(result.errorMessage);
    }
  }, [request, session]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onRefresh = async () => {
    setIsRefreshing(true);
    await load();
    setIsRefreshing(false);
  };

  const handleDelete = (notification: AdminNotification) => {
    Alert.alert('Delete notification', `Delete "${notification.subject}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const result = await deleteAdminNotification(request, notification.admin_notification_id);
          if (result.ok) {
            load();
          } else {
            Alert.alert('Could not delete notification', result.errorMessage);
          }
        },
      },
    ]);
  };

  return (
    <ThemedView style={styles.flex}>
      <SafeAreaView style={styles.flex} edges={['top', 'left', 'right', 'bottom']}>
        <ThemedText type="subtitle" style={[styles.header, { color: Primary }]}>
          View Notifications
        </ThemedText>

        <Pressable
          onPress={() => router.push('/send-notification')}
          style={({ pressed }) => [styles.sendButton, { backgroundColor: Primary, opacity: pressed ? 0.8 : 1 }]}
          aria-label="sendNewMessageButton">
          <ThemedText type="smallBold" style={styles.sendLabel}>
            Send New Message
          </ThemedText>
        </Pressable>

        <ThemedView style={[styles.listBox, { borderColor: theme.border }]}>
          {notifications === null && !errorMessage ? (
            <View style={styles.centered}>
              <ActivityIndicator color={theme.text} />
            </View>
          ) : errorMessage ? (
            <View style={styles.centered}>
              <ThemedText themeColor="error" style={styles.centerText}>
                {errorMessage}
              </ThemedText>
              <Pressable onPress={load} style={styles.retryButton}>
                <ThemedText type="linkPrimary">Retry</ThemedText>
              </Pressable>
            </View>
          ) : (
            <FlatList
              data={notifications}
              keyExtractor={(item) => String(item.admin_notification_id)}
              contentContainerStyle={styles.listContent}
              refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
              ListEmptyComponent={
                <ThemedView style={styles.centered}>
                  <ThemedText themeColor="textSecondary">No notifications yet.</ThemedText>
                </ThemedView>
              }
              renderItem={({ item }) => (
                <ThemedView type="backgroundElement" style={styles.card}>
                  <InfoRow label="Subject" value={item.subject} />
                  <InfoRow label="Message" value={item.message} />
                  <InfoRow label="Sent At" value={new Date(item.sent_at).toLocaleString()} />
                  <Pressable
                    onPress={() => handleDelete(item)}
                    style={styles.deleteRow}
                    aria-label={`deleteNotification${item.admin_notification_id}`}>
                    <ThemedText type="smallBold" themeColor="error">
                      Delete
                    </ThemedText>
                  </Pressable>
                </ThemedView>
              )}
            />
          )}
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <ThemedText type="small" themeColor="textSecondary" style={styles.infoLabel}>
        {label}
      </ThemedText>
      <ThemedText type="small" style={styles.infoValue}>
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
  },
  sendButton: {
    marginHorizontal: Spacing.three,
    marginBottom: Spacing.two,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendLabel: {
    color: '#ffffff',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  centerText: {
    textAlign: 'center',
  },
  retryButton: {
    padding: Spacing.two,
  },
  listBox: {
    flex: 1,
    marginHorizontal: Spacing.three,
    marginBottom: BottomTabInset + Spacing.one,
    borderRadius: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  listContent: {
    padding: Spacing.two,
    gap: Spacing.two,
  },
  card: {
    borderRadius: Spacing.two,
    padding: Spacing.three,
    gap: Spacing.half,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  infoLabel: {
    flex: 1,
  },
  infoValue: {
    flex: 2,
    textAlign: 'right',
  },
  deleteRow: {
    alignSelf: 'flex-end',
    marginTop: Spacing.one,
    padding: Spacing.one,
  },
});
