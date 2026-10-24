import { router, Stack, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { listCustomRubrics, type RubricWithCategories } from '@/api/rubrics';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Primary, Spacing } from '@/constants/theme';
import { useApi } from '@/hooks/use-api';
import { useTheme } from '@/hooks/use-theme';

// Sized so seven collapsed rubric cards show at once; expanded cards scroll inside the block.
const ONE_INCH = 72;
const CARD_HEIGHT = 58;
const CARD_GAP = Spacing.two;
const VISIBLE_CARDS = 7;
const LIST_BLOCK_HEIGHT = VISIBLE_CARDS * (CARD_HEIGHT + CARD_GAP) + Spacing.two * 2;

export default function CustomRubricsScreen() {
  const theme = useTheme();
  const request = useApi();

  const [rubrics, setRubrics] = useState<RubricWithCategories[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const load = useCallback(async () => {
    const result = await listCustomRubrics(request);
    if (result.ok) {
      setRubrics(result.data);
      setErrorMessage(null);
    } else {
      setErrorMessage(result.errorMessage);
    }
  }, [request]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <ThemedView style={styles.flex}>
      <Stack.Screen options={{ title: 'My Custom Rubrics' }} />
      <SafeAreaView style={styles.flex} edges={['left', 'right', 'bottom']}>
        <ThemedText type="subtitle" style={[styles.header, { color: Primary }]}>
          My Custom Rubrics
        </ThemedText>

        {rubrics === null && !errorMessage ? (
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
          <>
          <View style={[styles.listBlock, { borderColor: theme.border, height: LIST_BLOCK_HEIGHT }]}>
          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
            {rubrics!.length === 0 ? (
              <ThemedView type="backgroundElement" style={[styles.card, { borderColor: theme.border }]}>
                <ThemedText type="small" themeColor="textSecondary">
                  No custom rubrics found.
                </ThemedText>
              </ThemedView>
            ) : (
              rubrics!.map((rubric) => (
                <RubricCard
                  key={rubric.rubric_id}
                  rubric={rubric}
                  expanded={expandedId === rubric.rubric_id}
                  onToggle={() => setExpandedId(expandedId === rubric.rubric_id ? null : rubric.rubric_id)}
                />
              ))
            )}
          </ScrollView>
          </View>

          <View style={styles.addRow}>
          <Pressable
            onPress={() => router.push('/add-custom-rubric')}
            style={({ pressed }) => [styles.addButton, { opacity: pressed ? 0.8 : 1 }]}
            aria-label="addCustomRubricButton">
            <ThemedText type="smallBold" style={styles.buttonLabel}>
              Add Custom Rubric
            </ThemedText>
          </Pressable>
          </View>
          </>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

function RubricCard({
  rubric,
  expanded,
  onToggle,
}: {
  rubric: RubricWithCategories;
  expanded: boolean;
  onToggle: () => void;
}) {
  const theme = useTheme();
  return (
    <ThemedView type="backgroundElement" style={[styles.card, { borderColor: theme.border }]}>
      <Pressable onPress={onToggle} style={styles.rubricHeader} aria-label={`toggleRubric${rubric.rubric_id}`}>
        <View style={styles.rubricTitles}>
          <ThemedText type="smallBold" style={{ color: Primary }}>
            {rubric.rubric_name}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {rubric.category_total} categories
          </ThemedText>
        </View>
        <View style={styles.rubricActions}>
          <Pressable
            onPress={() => router.push({ pathname: '/add-custom-rubric', params: { rubricId: String(rubric.rubric_id) } })}
            style={styles.editButton}
            aria-label={`editRubric${rubric.rubric_id}`}>
            <ThemedText type="smallBold" style={styles.editLabel}>
              Edit
            </ThemedText>
          </Pressable>
          <ThemedText type="small" themeColor="textSecondary">
            {expanded ? '▲' : '▼'}
          </ThemedText>
        </View>
      </Pressable>

      {expanded && (
        <View style={styles.categoryList}>
          {rubric.categories.length === 0 ? (
            <ThemedText type="small" themeColor="textSecondary">
              No categories yet.
            </ThemedText>
          ) : (
            rubric.categories.map((category) => (
              <View key={category.category_id} style={styles.categoryRow}>
                <ThemedText type="small" style={styles.categoryName}>
                  {category.category_name}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.categoryValue}>
                  {category.default_rubric ?? 'N/A'}
                </ThemedText>
              </View>
            ))
          )}
        </View>
      )}
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
  listBlock: {
    marginHorizontal: Spacing.two,
    marginTop: Spacing.two,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Spacing.three,
    overflow: 'hidden',
  },
  scroll: {
    flex: 1,
  },
  addRow: {
    paddingHorizontal: Spacing.three,
    paddingVertical: ONE_INCH / 2,
  },
  addButton: {
    minHeight: 36,
    borderRadius: Spacing.two,
    backgroundColor: Primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  buttonLabel: {
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
  scrollContent: {
    padding: Spacing.two,
    gap: CARD_GAP,
  },
  card: {
    minHeight: CARD_HEIGHT,
    borderRadius: Spacing.two,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    gap: Spacing.one,
  },
  rubricHeader: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  rubricTitles: {
    flex: 1,
    gap: Spacing.half,
  },
  rubricActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  editButton: {
    backgroundColor: Primary,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  editLabel: {
    color: '#ffffff',
  },
  categoryList: {
    gap: Spacing.one,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.two,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  categoryName: {
    flex: 1,
  },
  categoryValue: {
    flex: 1,
    textAlign: 'right',
  },
});
