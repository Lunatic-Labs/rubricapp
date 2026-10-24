import { router, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type AssessmentTaskView, listAssessmentTasksForCourse } from '@/api/assessment-tasks';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Primary, Spacing } from '@/constants/theme';
import { useApi } from '@/hooks/use-api';
import { useTheme } from '@/hooks/use-theme';

// Roughly one inch of breathing room between the sort dropdown, the task list, and the buttons.
const ONE_INCH = 72;

const TASK_ACTIONS = ['My Custom Rubric', 'Import Tasks', 'Add Task'].map((label) => ({ label }));

type SortKey = 'due-soonest' | 'due-latest' | 'oldest-first' | 'newest-first';

const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: 'Due Soonest', value: 'due-soonest' },
  { label: 'Due Latest', value: 'due-latest' },
  { label: 'Oldest First', value: 'oldest-first' },
  { label: 'Newest First', value: 'newest-first' },
];

function sortTasks(tasks: AssessmentTaskView[], sortKey: SortKey): AssessmentTaskView[] {
  const sorted = [...tasks];
  // Tasks with no due date go last in both date orderings.
  const dueTime = (task: AssessmentTaskView, missing: number) =>
    task.due_date ? Date.parse(task.due_date) : missing;
  switch (sortKey) {
    case 'due-soonest':
      return sorted.sort((a, b) => dueTime(a, Number.MAX_SAFE_INTEGER) - dueTime(b, Number.MAX_SAFE_INTEGER));
    case 'due-latest':
      return sorted.sort((a, b) => dueTime(b, Number.MIN_SAFE_INTEGER) - dueTime(a, Number.MIN_SAFE_INTEGER));
    case 'oldest-first':
      // No creation-date field exists on assessment tasks — ID order is the
      // closest available proxy, since IDs are assigned in creation order.
      return sorted.sort((a, b) => a.assessment_task_id - b.assessment_task_id);
    case 'newest-first':
      return sorted.sort((a, b) => b.assessment_task_id - a.assessment_task_id);
  }
}

export default function CourseAssessmentTasksScreen() {
  const { courseId, courseName } = useLocalSearchParams<{ courseId: string; courseName?: string }>();
  const theme = useTheme();
  const request = useApi();

  const [tasks, setTasks] = useState<AssessmentTaskView[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('due-soonest');
  const [sortOpen, setSortOpen] = useState(false);

  const load = useCallback(async () => {
    const result = await listAssessmentTasksForCourse(request, courseId);
    if (result.ok) {
      setTasks(result.data);
      setErrorMessage(null);
    } else {
      setErrorMessage(result.errorMessage);
    }
  }, [request, courseId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const sortedTasks = useMemo(() => (tasks ? sortTasks(tasks, sortKey) : []), [tasks, sortKey]);

  return (
    <ThemedView style={styles.flex}>
      <Stack.Screen options={{ title: courseName ?? 'Course' }} />
      <SafeAreaView style={styles.flex} edges={['left', 'right', 'bottom']}>
        <ThemedText type="subtitle" style={[styles.header, { color: Primary }]}>
          Assessment Tasks
        </ThemedText>

        {tasks === null && !errorMessage ? (
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
            <View style={styles.sortRow}>
              <ThemedText type="smallBold" style={styles.sortLabel}>
                Sort by
              </ThemedText>
              <View style={styles.sortDropdown}>
                <Pressable
                  onPress={() => setSortOpen((open) => !open)}
                  style={[styles.sortTrigger, { borderColor: theme.border }]}
                  aria-label="sortDropdown">
                  <ThemedText type="small">{SORT_OPTIONS.find((o) => o.value === sortKey)?.label}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {sortOpen ? '▲' : '▼'}
                  </ThemedText>
                </Pressable>
                {sortOpen && (
                  <View style={[styles.sortMenu, { borderColor: theme.border, backgroundColor: theme.background }]}>
                    {SORT_OPTIONS.map((option) => (
                      <Pressable
                        key={option.value}
                        onPress={() => {
                          setSortKey(option.value);
                          setSortOpen(false);
                        }}
                        style={styles.sortOption}
                        aria-label={`sortOption-${option.value}`}>
                        <ThemedText type={option.value === sortKey ? 'smallBold' : 'small'}>{option.label}</ThemedText>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            </View>

            <View style={styles.listArea}>
            <View style={[styles.listBlock, { borderColor: theme.border }]}>
            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
              {sortedTasks.length === 0 ? (
                <ThemedView type="backgroundElement" style={styles.card}>
                  <ThemedText type="small" themeColor="textSecondary">
                    No assessment tasks for this course yet.
                  </ThemedText>
                </ThemedView>
              ) : (
                sortedTasks.map((task) => (
                  <TaskCard key={task.assessment_task_id} task={task} />
                ))
              )}
            </ScrollView>
            </View>
            </View>

            <View style={styles.actionRow}>
              {TASK_ACTIONS.map((action) => (
                <Pressable
                  key={action.label}
                  onPress={() =>
                    action.label === 'My Custom Rubric'
                      ? router.push('/custom-rubrics')
                      : action.label === 'Import Tasks'
                        ? router.push({ pathname: '/import-tasks', params: { courseId: String(courseId) } })
                        : action.label === 'Add Task'
                          ? router.push({ pathname: '/add-task', params: { courseId: String(courseId) } })
                          : Alert.alert(action.label, 'This screen has not been built yet.')
                  }
                  style={({ pressed }) => [
                    styles.actionButton,
                    { backgroundColor: Primary, borderColor: Primary, opacity: pressed ? 0.8 : 1 },
                  ]}
                  aria-label={action.label}>
                  <ThemedText type="smallBold" style={[styles.actionLabel, { color: '#ffffff' }]}>
                    {action.label}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

function TaskCard({ task }: { task: AssessmentTaskView }) {
  const theme = useTheme();
  return (
    <ThemedView
      type="backgroundElement"
      style={[styles.card, { borderColor: theme.border }]}>
      <InfoRow label="Task Name" value={task.assessment_task_name} emphasize />
      <InfoRow label="Due Date" value={task.due_date ? new Date(task.due_date).toLocaleString() : 'N/A'} />
      <InfoRow label="Completed By" value={task.roleName} />
      <InfoRow label="Rubric Used" value={task.rubricName} />
      <InfoRow label="Team" value={task.unit_of_assessment ? 'Yes' : 'No'} />
    </ThemedView>
  );
}

function InfoRow({ label, value, emphasize }: { label: string; value: string; emphasize?: boolean }) {
  return (
    <View style={styles.infoRow}>
      <ThemedText type="small" themeColor="textSecondary" style={[styles.infoText, styles.infoLabel]}>
        {label}
      </ThemedText>
      <ThemedText
        type={emphasize ? 'smallBold' : 'small'}
        style={[styles.infoText, styles.infoValue, emphasize && { color: Primary }]}>
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
  listArea: {
    flex: 1,
    justifyContent: 'center',
  },
  listBlock: {
    flex: 1,
    marginHorizontal: Spacing.two,
    marginTop: Spacing.five,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Spacing.three,
    overflow: 'hidden',
  },
  scroll: {
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: ONE_INCH / 2,
  },
  actionButton: {
    flex: 1,
    minHeight: 28,
    borderWidth: 0,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.one,
    paddingVertical: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    textAlign: 'center',
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.two,
  },
  sortLabel: {
    flexShrink: 0,
  },
  sortDropdown: {
    flex: 1,
  },
  sortTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  sortMenu: {
    marginTop: Spacing.one,
    borderWidth: 1,
    borderRadius: Spacing.two,
    overflow: 'hidden',
  },
  sortOption: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
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
    gap: Spacing.two,
  },
  card: {
    borderRadius: Spacing.two,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    gap: Spacing.one,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.three,
    paddingVertical: 1,
  },
  infoLabel: {
    flex: 1,
  },
  infoValue: {
    flex: 2,
    textAlign: 'right',
  },
});
