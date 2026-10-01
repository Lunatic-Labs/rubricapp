import { router, useFocusEffect } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  type LayoutChangeEvent,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type AdminUser, deleteUser, listUsers } from '@/api/users';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Primary, Spacing } from '@/constants/theme';
import { useSession } from '@/context/session';
import { useApi } from '@/hooks/use-api';
import { useTheme } from '@/hooks/use-theme';

// Rows have a fixed height so the list box's height can be floored to a whole
// number of rows below — otherwise the last row at the bottom edge gets cut
// off mid-row instead of either fully showing or fully scrolling out of view.
const ROW_HEIGHT = 84;
const ROW_UNIT = ROW_HEIGHT + Spacing.two; // row height + inter-row gap

export default function UsersScreen() {
  const theme = useTheme();
  const { session } = useSession();
  const request = useApi();

  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [boxHeight, setBoxHeight] = useState<number | null>(null);

  // Floors the box to a whole number of rows, so the last row is either
  // fully visible or fully scrolled away — never cut off mid-row.
  const handleAreaLayout = (event: LayoutChangeEvent) => {
    const available = event.nativeEvent.layout.height;
    const rows = Math.max(1, Math.floor((available - Spacing.two) / ROW_UNIT));
    setBoxHeight(rows * ROW_UNIT + Spacing.two);
  };

  const load = useCallback(async () => {
    const result = await listUsers(request, !!session?.user.isSuperAdmin);
    if (result.ok) {
      setUsers(result.data);
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

  return (
    <ThemedView style={styles.flex}>
      <SafeAreaView style={styles.flex} edges={['top', 'left', 'right', 'bottom']}>
        <ThemedText type="subtitle" style={[styles.header, { color: Primary }]}>
          Users
        </ThemedText>

        <Pressable
          onPress={() => router.push('/add-user')}
          style={({ pressed }) => [styles.addButton, { backgroundColor: Primary, opacity: pressed ? 0.8 : 1 }]}
          aria-label="addUserButton">
          <ThemedText type="smallBold" style={styles.addLabel}>
            Add User
          </ThemedText>
        </Pressable>

        <View style={styles.listArea} onLayout={handleAreaLayout}>
        {boxHeight == null ? null : (
        <ThemedView style={[styles.listBox, { height: boxHeight, borderColor: theme.border }]}>
        {users === null && !errorMessage ? (
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
            data={users}
            keyExtractor={(user) => String(user.user_id)}
            contentContainerStyle={styles.listContent}
            snapToInterval={ROW_UNIT}
            decelerationRate="fast"
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
            ListEmptyComponent={
              <ThemedView style={styles.centered}>
                <ThemedText themeColor="textSecondary">No users found.</ThemedText>
              </ThemedView>
            }
            renderItem={({ item }) => (
              <ThemedView type="backgroundElement" style={styles.row}>
                <View style={styles.rowInfo}>
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
                </View>

                <View style={styles.rowActions}>
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: '/user-courses',
                        params: { userId: String(item.user_id), userName: `${item.first_name} ${item.last_name}` },
                      })
                    }
                    style={styles.actionButton}
                    aria-label={`viewUsersViewButton${item.user_id}`}>
                    <SymbolView
                      name={{ ios: 'eye', android: 'visibility', web: 'visibility' }}
                      tintColor={theme.text}
                      size={20}
                    />
                  </Pressable>
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: '/edit-user',
                        params: {
                          userId: String(item.user_id),
                          firstName: item.first_name,
                          lastName: item.last_name,
                          email: item.email,
                          lmsId: item.lms_id != null ? String(item.lms_id) : '',
                        },
                      })
                    }
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
                </View>
              </ThemedView>
            )}
          />
        )}
        </ThemedView>
        )}
        </View>
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
  addButton: {
    marginHorizontal: Spacing.three,
    marginBottom: Spacing.two,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addLabel: {
    color: '#ffffff',
  },
  listArea: {
    flex: 1,
    marginHorizontal: Spacing.three,
    marginBottom: BottomTabInset + Spacing.one,
  },
  listBox: {
    borderRadius: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  listContent: {
    padding: Spacing.two,
    gap: Spacing.two,
  },
  row: {
    height: ROW_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
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
