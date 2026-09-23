import { SymbolView } from 'expo-symbols';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type AdminUser, deleteUser, listUsers } from '@/api/users';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useSession } from '@/context/session';
import { useApi } from '@/hooks/use-api';
import { useTheme } from '@/hooks/use-theme';

export default function UsersScreen() {
  const theme = useTheme();
  const { session } = useSession();
  const request = useApi();

  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const load = useCallback(async () => {
    const result = await listUsers(request, !!session?.user.isSuperAdmin);
    if (result.ok) {
      setUsers(result.data);
      setErrorMessage(null);
    } else {
      setErrorMessage(result.errorMessage);
    }
  }, [request, session]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await load();
    setIsRefreshing(false);
  };

  const handleDelete = (user: AdminUser) => {
    Alert.alert('Delete user', `Delete ${user.first_name} ${user.last_name}? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const result = await deleteUser(request, user.user_id);
          if (result.ok) {
            load();
          } else {
            Alert.alert('Could not delete user', result.errorMessage);
          }
        },
      },
    ]);
  };

  const notBuiltYet = (feature: string) =>
    Alert.alert(feature, 'This screen has not been built yet.');

  return (
    <ThemedView style={styles.flex}>
      <SafeAreaView style={styles.flex} edges={['top', 'left', 'right']}>
        <ThemedText type="subtitle" style={styles.header}>
          Users
        </ThemedText>

        {users === null && !errorMessage ? (
          <ThemedView style={styles.centered}>
            <ActivityIndicator color={theme.text} />
          </ThemedView>
        ) : errorMessage ? (
          <ThemedView style={styles.centered}>
            <ThemedText themeColor="error" style={styles.centerText}>
              {errorMessage}
            </ThemedText>
            <Pressable onPress={load} style={styles.retryButton}>
              <ThemedText type="linkPrimary">Retry</ThemedText>
            </Pressable>
          </ThemedView>
        ) : (
          <FlatList
            data={users}
            keyExtractor={(user) => String(user.user_id)}
            contentContainerStyle={styles.listContent}
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
            ListEmptyComponent={
              <ThemedView style={styles.centered}>
                <ThemedText themeColor="textSecondary">No users found.</ThemedText>
              </ThemedView>
            }
            renderItem={({ item }) => (
              <ThemedView type="backgroundElement" style={styles.row}>
                <ThemedView style={styles.rowInfo}>
                  <ThemedText type="smallBold">
                    {item.first_name} {item.last_name}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {item.email}
                  </ThemedText>
                  {item.lms_id != null && (
                    <ThemedText type="code" themeColor="textSecondary">
                      LMS ID: {item.lms_id}
                    </ThemedText>
                  )}
                </ThemedView>

                <ThemedView style={styles.rowActions}>
                  <Pressable
                    onPress={() => notBuiltYet('View user')}
                    style={styles.actionButton}
                    aria-label={`viewUsersViewButton${item.user_id}`}>
                    <SymbolView
                      name={{ ios: 'eye', android: 'visibility', web: 'visibility' }}
                      tintColor={theme.text}
                      size={20}
                    />
                  </Pressable>
                  <Pressable
                    onPress={() => notBuiltYet('Edit user')}
                    style={styles.actionButton}
                    aria-label={`viewUsersEditButton${item.user_id}`}>
                    <SymbolView
                      name={{ ios: 'pencil', android: 'edit', web: 'edit' }}
                      tintColor={theme.text}
                      size={20}
                    />
                  </Pressable>
                  <Pressable
                    onPress={() => handleDelete(item)}
                    style={styles.actionButton}
                    aria-label={`viewUsersDeleteButton${item.user_id}`}>
                    <SymbolView
                      name={{ ios: 'trash', android: 'delete', web: 'delete' }}
                      tintColor={theme.error}
                      size={20}
                    />
                  </Pressable>
                </ThemedView>
              </ThemedView>
            )}
          />
        )}
      </SafeAreaView>
    </ThemedView>
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
  listContent: {
    paddingHorizontal: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: Spacing.two,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  rowInfo: {
    flex: 1,
    gap: Spacing.half,
  },
  rowActions: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  actionButton: {
    padding: Spacing.one,
  },
});
