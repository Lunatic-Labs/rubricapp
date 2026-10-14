import { router, Stack, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type Course, listCoursesForAdmin } from '@/api/courses';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Primary, Spacing } from '@/constants/theme';
import { useApi } from '@/hooks/use-api';
import { useTheme } from '@/hooks/use-theme';

// Each block shows exactly three course cards; extra cards scroll inside it.
const CARD_HEIGHT = 144;
const CARD_GAP = 8;
const BLOCK_HEIGHT = 3 * CARD_HEIGHT + 2 * CARD_GAP + 2 * 8;

export default function UserCoursesScreen() {
  const { userId, userName } = useLocalSearchParams<{ userId: string; userName?: string }>();
  const theme = useTheme();
  const request = useApi();

  const [courses, setCourses] = useState<Course[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    const result = await listCoursesForAdmin(request, userId);
    if (result.ok) {
      setCourses(result.data);
      setErrorMessage(null);
    } else {
      setErrorMessage(result.errorMessage);
    }
  }, [request, userId]);

  useEffect(() => {
    load();
  }, [load]);

  const activeCourses = courses?.filter((course) => course.active) ?? [];
  const inactiveCourses = courses?.filter((course) => !course.active) ?? [];

  return (
    <ThemedView style={styles.flex}>
      <Stack.Screen options={{ title: userName ? `${userName}'s Courses` : 'Courses' }} />
      <SafeAreaView style={styles.flex} edges={['left', 'right', 'bottom']}>
        {courses === null && !errorMessage ? (
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
          // Both sections always render — even with zero courses — so the page
          // never looks blank/broken; each one shows its own empty state instead.
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <CourseSection title="Active Courses" courses={activeCourses} />
            <CourseSection title="Inactive Courses" courses={inactiveCourses} />
          </ScrollView>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

function CourseSection({ title, courses }: { title: string; courses: Course[] }) {
  const theme = useTheme();
  return (
    <View style={styles.section}>
      <ThemedText type="subtitle" style={[styles.sectionTitle, { color: Primary }]}>
        {title}
      </ThemedText>
      <View style={[styles.sectionBlock, { borderColor: theme.border }]}>
        <ScrollView style={styles.blockScroll} contentContainerStyle={styles.blockContent}>
          {courses.length === 0 ? (
            <ThemedView type="backgroundElement" style={[styles.card, { borderColor: theme.border }]}>
              <ThemedText type="small" themeColor="textSecondary">
                No {title.toLowerCase()}.
              </ThemedText>
            </ThemedView>
          ) : (
            courses.map((course) => <CourseCard key={course.course_id} course={course} />)
          )}
        </ScrollView>
      </View>
    </View>
  );
}

// Field-labeled card, one row per column — the same "stack columns as
// key/value pairs" pattern FrontEndReact's tables already use on narrow
// screens (mui-datatables' "vertical" responsive mode), since a literal
// 7-column table has no room to be legible on a phone.
function CourseCard({ course }: { course: Course }) {
  const theme = useTheme();
  return (
    <ThemedView type="backgroundElement" style={[styles.card, { borderColor: theme.border }]}>
      <InfoRow label="Course Name" value={course.course_name} />
      <InfoRow label="Course Number" value={course.course_number} />
      <InfoRow label="Term" value={course.term} />
      <InfoRow label="Year" value={String(course.year)} />
      <InfoRow label="Use T.A.'s" value={course.use_tas ? 'Yes' : 'No'} />
      <InfoRow label="Fixed Teams" value={course.use_fixed_teams ? 'Yes' : 'No'} />
      <Pressable
        onPress={() =>
          router.push({
            pathname: '/course-assessment-tasks',
            params: { courseId: String(course.course_id), courseName: course.course_name },
          })
        }
        style={styles.viewRow}
        aria-label={`viewCourse${course.course_id}`}>
        <ThemedText type="linkPrimary" style={{ fontSize: 12, lineHeight: 16 }}>View</ThemedText>
        <SymbolView
          name={{ ios: 'eye', android: 'visibility', web: 'visibility' }}
          tintColor={Primary}
          size={12}
        />
      </Pressable>
    </ThemedView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <ThemedText type="small" themeColor="textSecondary" style={styles.infoLabel} numberOfLines={1}>
        {label}
      </ThemedText>
      <ThemedText type="small" style={styles.infoValue} numberOfLines={1} ellipsizeMode="tail">
        {value}
      </ThemedText>
    </View>
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
  retryButton: {
    padding: Spacing.two,
  },
  scrollContent: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  section: {
    gap: Spacing.two,
  },
  sectionTitle: {
    paddingHorizontal: Spacing.one,
    paddingBottom: Spacing.one,
  },
  sectionBlock: {
    height: BLOCK_HEIGHT,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Spacing.three,
    overflow: 'hidden',
  },
  blockScroll: {
    flex: 1,
  },
  blockContent: {
    padding: Spacing.two,
    gap: CARD_GAP,
  },
  card: {
    height: CARD_HEIGHT,
    justifyContent: 'center',
    borderRadius: Spacing.two,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    gap: 0,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  infoLabel: {
    flex: 1,
    fontSize: 13,
    lineHeight: 17,
  },
  infoValue: {
    flex: 1.6,
    fontSize: 13,
    textAlign: 'right',
    lineHeight: 17,
  },
  viewRow: {
    borderWidth: 1,
    borderColor: Primary,
    borderRadius: Spacing.one,
    paddingHorizontal: Spacing.one,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    alignSelf: 'flex-end',
    paddingVertical: 0,
  },
});
