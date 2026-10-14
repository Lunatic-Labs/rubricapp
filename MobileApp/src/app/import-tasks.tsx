import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type ImportableCourse, importAssessmentTasks, listCoursesToImportFrom } from '@/api/assessment-tasks';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Primary, Spacing } from '@/constants/theme';
import { useApi } from '@/hooks/use-api';
import { useTheme } from '@/hooks/use-theme';

export default function ImportTasksScreen() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const theme = useTheme();
  const request = useApi();

  const [courses, setCourses] = useState<ImportableCourse[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = useCallback(async () => {
    const result = await listCoursesToImportFrom(request, courseId);
    if (result.ok) {
      setCourses(result.data);
      setLoadError(null);
    } else {
      setLoadError(result.errorMessage);
    }
  }, [request, courseId]);

  useEffect(() => {
    load();
  }, [load]);

  const selectedCourse = courses?.find((course) => course.course_id === selectedId) ?? null;

  const handleImport = async () => {
    if (selectedId === null) {
      setFieldError('Please select a course to import tasks from.');
      return;
    }
    setSubmitError(null);
    setIsSubmitting(true);
    const result = await importAssessmentTasks(request, selectedId, courseId);
    setIsSubmitting(false);
    if (!result.ok) {
      setSubmitError(result.errorMessage);
      return;
    }
    router.back();
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ThemedView style={styles.flex}>
        <Stack.Screen options={{ title: 'Import Tasks' }} />
        <SafeAreaView style={styles.flex} edges={['left', 'right', 'bottom']}>
          {courses === null && !loadError ? (
            <View style={styles.centered}>
              <ActivityIndicator color={theme.text} />
            </View>
          ) : loadError ? (
            <View style={styles.centered}>
              <ThemedText themeColor="error" style={styles.centerText}>
                {loadError}
              </ThemedText>
              <Pressable onPress={load} style={styles.textButton}>
                <ThemedText type="linkPrimary">Retry</ThemedText>
              </Pressable>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <ThemedView type="backgroundElement" style={[styles.card, { borderColor: theme.border }]}>
                <ThemedText type="subtitle" style={{ color: Primary }}>
                  Import Tasks
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  Select the course you would like to import assessment tasks from.
                </ThemedText>

                <ThemedText type="smallBold" style={styles.label}>
                  Course
                </ThemedText>
                <Pressable
                  onPress={() => setMenuOpen((open) => !open)}
                  style={[styles.dropdownTrigger, { borderColor: fieldError ? theme.error : theme.border }]}
                  aria-label="importCourseDropdown">
                  <ThemedText type="small">{selectedCourse ? selectedCourse.course_name : 'Select a course'}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {menuOpen ? '▲' : '▼'}
                  </ThemedText>
                </Pressable>

                {menuOpen && (
                  <View style={[styles.dropdownMenu, { borderColor: theme.border }]}>
                    {courses!.length === 0 ? (
                      <ThemedText type="small" themeColor="textSecondary" style={styles.option}>
                        No other courses available.
                      </ThemedText>
                    ) : (
                      courses!.map((course) => (
                        <Pressable
                          key={course.course_id}
                          onPress={() => {
                            setSelectedId(course.course_id);
                            setFieldError(null);
                            setMenuOpen(false);
                          }}
                          style={styles.option}
                          aria-label={`importCourseOption${course.course_id}`}>
                          <ThemedText type={course.course_id === selectedId ? 'smallBold' : 'small'}>
                            {course.course_name}
                          </ThemedText>
                        </Pressable>
                      ))
                    )}
                  </View>
                )}

                {!!fieldError && (
                  <ThemedText type="small" themeColor="error">
                    {fieldError}
                  </ThemedText>
                )}
                {!!submitError && (
                  <ThemedText type="small" themeColor="error">
                    {submitError}
                  </ThemedText>
                )}

                <View style={styles.actionRow}>
                  <Pressable onPress={() => router.back()} style={styles.cancelButton} aria-label="cancelImportTasksButton">
                    <ThemedText type="smallBold" style={{ color: Primary }}>
                      Cancel
                    </ThemedText>
                  </Pressable>
                  <Pressable
                    onPress={handleImport}
                    disabled={isSubmitting}
                    style={({ pressed }) => [styles.importButton, { opacity: pressed || isSubmitting ? 0.8 : 1 }]}
                    aria-label="importTasksSubmitButton">
                    {isSubmitting ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <ThemedText type="smallBold" style={styles.importLabel}>
                        Import Tasks
                      </ThemedText>
                    )}
                  </Pressable>
                </View>
              </ThemedView>
            </ScrollView>
          )}
        </SafeAreaView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
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
  textButton: {
    padding: Spacing.two,
  },
  scrollContent: {
    padding: Spacing.four,
  },
  card: {
    borderRadius: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.four,
    gap: Spacing.one,
  },
  label: {
    marginTop: Spacing.three,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  dropdownMenu: {
    marginTop: Spacing.one,
    borderWidth: 1,
    borderRadius: Spacing.two,
    overflow: 'hidden',
  },
  option: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: Spacing.three,
    marginTop: Spacing.four,
  },
  cancelButton: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  importButton: {
    minWidth: 140,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Primary,
  },
  importLabel: {
    color: '#ffffff',
  },
});
