import { Picker } from '@expo/ui';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type AssessmentTaskView, listAssessmentTasksForCourse } from '@/api/assessment-tasks';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Primary, Spacing } from '@/constants/theme';
import { useApi } from '@/hooks/use-api';
import { useTheme } from '@/hooks/use-theme';

type SortKey = 'due-soonest' | 'due-latest' | 'oldest-first' | 'newest-first';

const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: 'Due Soonest', value: 'due-soonest' },
  { label: 'Due Latest', value: 'due-latest' },
  { label: 'Oldest First', value: 'oldest-first' },
  { label: 'Newest First', value: 'newest-first' },
];

function sortTasks(tasks: AssessmentTaskView[], sortKey: SortKey): AssessmentTaskView[] {
  const sorted = [...tasks];
  switch (sortKey) {
    case 'due-soonest':
      // Tasks with no due date are treated as lowest priority, sorted last.
      return sorted.sort((a, b) => (a.due_date ? Date.parse(a.due_date) : Infinity) - (b.due_date ? Date.parse(b.due_date) : Infinity));
    case 'due-latest':
      return sorted.sort((a, b) => (b.due_date ? Date.parse(b.due_date) : -Infinity) - (a.due_date ? Date.parse(a.due_date) : -Infinity));
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

  const load = useCallback(async () => {
    const result = await listAssessmentTasksForCourse(request, courseId);
    if (result.ok) {
      setTasks(result.data);
      setErrorMessage(null);
    } else {
      setErrorMessage(result.errorMessage);
    }
  }, [request, courseId]);

  useEffect(() => {
    load();
  }, [load]);

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
              <Picker selectedValue={sortKey} onValueChange={(value) => setSortKey(value as SortKey)}>
                {SORT_OPTIONS.map((option) => (
                  <Picker.Item key={option.value} label={option.label} value={option.value} />
                ))}
              </Picker>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
              {sortedTasks.length === 0 ? (
                <ThemedView type="backgroundElement" style={styles.card}>
                  <ThemedText type="small" themeColor="textSecondary">
                    No assessment tasks for this course yet.
                  </ThemedText>
                </ThemedView>
              ) : (
                sortedTasks.map((task) => <TaskCard key={task.assessment_task_id} task={task} />)
              )}
            </ScrollView>
          </>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

function TaskCard({ task }: { task: AssessmentTaskView }) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
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
      <ThemedText type="small" themeColor="textSecondary" style={styles.infoLabel}>
        {label}
      </ThemedText>
      <ThemedText
        type={emphasize ? 'smallBold' : 'small'}
        style={[styles.infoValue, emphasize && { color: Primary }]}>
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
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
  },
  sortLabel: {
    flexShrink: 0,
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
    padding: Spacing.three,
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
});
