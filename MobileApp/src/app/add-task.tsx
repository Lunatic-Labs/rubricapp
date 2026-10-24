import { router, Stack, useLocalSearchParams } from 'expo-router';
import { type ReactNode, useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  createAssessmentTask,
  listAssessmentTaskOptions,
  type RoleOption,
  type RubricOption,
} from '@/api/assessment-tasks';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MAX_PASSWORD_LENGTH } from '@/constants/password';
import { Primary, Spacing } from '@/constants/theme';
import { useApi } from '@/hooks/use-api';
import { useTheme } from '@/hooks/use-theme';

const TIME_ZONES = [
  { value: 'America/New_York', label: 'Eastern Time' },
  { value: 'America/Chicago', label: 'Central Time' },
  { value: 'America/Denver', label: 'Mountain Time' },
  { value: 'America/Los_Angeles', label: 'Pacific Time' },
];

const MAX_TASK_NAME_LENGTH = 50;
const DUE_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/;

function formatLocalDateTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function parseDueDate(text: string): Date | null {
  const match = DUE_DATE_PATTERN.exec(text.trim());
  if (!match) return null;
  const [, year, month, day, hour, minute] = match.map(Number);
  const date = new Date(year, month - 1, day, hour, minute);
  return Number.isNaN(date.getTime()) ? null : date;
}

interface FormErrors {
  name: string;
  rubric: string;
  roleId: string;
  dueDate: string;
  numberOfTeams: string;
  maxTeamSize: string;
  teamPassword: string;
  notes: string;
}

const NO_ERRORS: FormErrors = {
  name: '',
  rubric: '',
  roleId: '',
  dueDate: '',
  numberOfTeams: '',
  maxTeamSize: '',
  teamPassword: '',
  notes: '',
};

export default function AddTaskScreen() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const theme = useTheme();
  const request = useApi();

  const [rubrics, setRubrics] = useState<RubricOption[] | null>(null);
  const [roles, setRoles] = useState<RoleOption[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [rubricId, setRubricId] = useState<number | null>(null);
  const [roleId, setRoleId] = useState<number | null>(null);
  const [dueText, setDueText] = useState(() => formatLocalDateTime(new Date()));
  const [timeZone, setTimeZone] = useState(TIME_ZONES[1].value);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showRatings, setShowRatings] = useState(true);
  const [usingTeams, setUsingTeams] = useState(false);
  const [teamPassword, setTeamPassword] = useState('');
  const [notes, setNotes] = useState('');
  const [numberOfTeams, setNumberOfTeams] = useState('');
  const [maxTeamSize, setMaxTeamSize] = useState('');

  const [errors, setErrors] = useState<FormErrors>(NO_ERRORS);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openMenu, setOpenMenu] = useState<'rubric' | 'timeZone' | null>(null);

  const loadOptions = useCallback(async () => {
    const result = await listAssessmentTaskOptions(request);
    if (result.ok) {
      setRubrics(result.data.rubrics);
      setRoles(result.data.roles);
      setLoadError(null);
    } else {
      setLoadError(result.errorMessage);
    }
  }, [request]);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  const handleCreate = async () => {
    const dueDate = parseDueDate(dueText);
    const nextErrors: FormErrors = {
      name:
        name.trim() === ''
          ? 'Task name cannot be empty'
          : name.length > MAX_TASK_NAME_LENGTH
            ? `Task name cannot exceed ${MAX_TASK_NAME_LENGTH} characters`
            : '',
      rubric: rubricId === null ? 'Choose a rubric' : '',
      roleId: roleId === null ? 'Choose who completes this task' : '',
      dueDate: dueDate === null ? 'Use the format YYYY-MM-DD HH:MM' : '',
      numberOfTeams:
        usingTeams && !/^[1-9]\d*$/.test(numberOfTeams) ? 'Enter a number greater than zero' : '',
      maxTeamSize: usingTeams && !/^[1-9]\d*$/.test(maxTeamSize) ? 'Enter a number greater than zero' : '',
      teamPassword:
        teamPassword.length > MAX_PASSWORD_LENGTH ? `Password cannot exceed ${MAX_PASSWORD_LENGTH} characters` : '',
      notes: notes.trim() === '' ? 'Instructions cannot be empty' : '',
    };
    setErrors(nextErrors);
    const hasError = Object.values(nextErrors).some((message) => message !== '');
    if (hasError || rubricId === null || roleId === null || dueDate === null) return;

    setSubmitError(null);
    setIsSubmitting(true);
    const result = await createAssessmentTask(request, courseId, {
      name: name.trim(),
      rubricId,
      roleId,
      dueDate,
      timeZone,
      showSuggestions,
      showRatings,
      usingTeams,
      teamPassword,
      notes: notes.trim(),
      numberOfTeams,
      maxTeamSize,
    });
    setIsSubmitting(false);

    if (!result.ok) {
      setSubmitError(result.errorMessage);
      return;
    }
    router.back();
  };

  const selectedRubric = rubrics?.find((rubric) => rubric.rubric_id === rubricId);
  const selectedTimeZone = TIME_ZONES.find((zone) => zone.value === timeZone);

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ThemedView style={styles.flex}>
        <Stack.Screen options={{ title: 'Add Task' }} />
        <SafeAreaView style={styles.flex} edges={['left', 'right', 'bottom']}>
          {rubrics === null && !loadError ? (
            <View style={styles.centered}>
              <ActivityIndicator color={theme.text} />
            </View>
          ) : loadError ? (
            <View style={styles.centered}>
              <ThemedText themeColor="error" style={styles.centerText}>
                {loadError}
              </ThemedText>
              <Pressable onPress={loadOptions} style={styles.textButton}>
                <ThemedText type="linkPrimary">Retry</ThemedText>
              </Pressable>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
              <ThemedView type="backgroundElement" style={[styles.card, { borderColor: theme.border }]}>
                <ThemedText type="subtitle" style={{ color: Primary }}>
                  Add Task
                </ThemedText>

                <Field label="Task Name" error={errors.name}>
                  <TextInput
                    value={name}
                    onChangeText={(value) => {
                      setName(value);
                      setErrors((prev) => ({ ...prev, name: '' }));
                    }}
                    maxLength={MAX_TASK_NAME_LENGTH + 1}
                    aria-label="addTaskNameInput"
                    style={[styles.input, { color: theme.text, borderColor: errors.name ? theme.error : theme.border }]}
                  />
                </Field>

                <Field label="Rubric" error={errors.rubric}>
                  <Pressable
                    onPress={() => setOpenMenu(openMenu === 'rubric' ? null : 'rubric')}
                    style={[styles.dropdownTrigger, { borderColor: errors.rubric ? theme.error : theme.border }]}
                    aria-label="addTaskRubricDropdown">
                    <ThemedText type="small">{selectedRubric ? selectedRubric.rubric_name : 'Select a rubric'}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {openMenu === 'rubric' ? '▲' : '▼'}
                    </ThemedText>
                  </Pressable>
                  {openMenu === 'rubric' && (
                    <View style={[styles.dropdownMenu, { borderColor: theme.border }]}>
                      {rubrics!.map((rubric) => (
                        <Pressable
                          key={rubric.rubric_id}
                          onPress={() => {
                            setRubricId(rubric.rubric_id);
                            setErrors((prev) => ({ ...prev, rubric: '' }));
                            setOpenMenu(null);
                          }}
                          style={styles.option}>
                          <ThemedText type={rubric.rubric_id === rubricId ? 'smallBold' : 'small'}>
                            {rubric.rubric_name}
                          </ThemedText>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </Field>

                <Field label="Completed By" error={errors.roleId}>
                  <View style={styles.segmentRow}>
                    {roles!.map((role) => {
                      const selected = role.role_id === roleId;
                      return (
                        <Pressable
                          key={role.role_id}
                          onPress={() => {
                            setRoleId(role.role_id);
                            setErrors((prev) => ({ ...prev, roleId: '' }));
                          }}
                          style={[
                            styles.segment,
                            { backgroundColor: selected ? Primary : theme.backgroundElement },
                          ]}>
                          <ThemedText type="smallBold" style={{ color: selected ? '#ffffff' : theme.text }}>
                            {role.role_name}
                          </ThemedText>
                        </Pressable>
                      );
                    })}
                  </View>
                </Field>

                <Field label="Assessment Type">
                  <View style={styles.segmentRow}>
                    {[
                      { label: 'Individual', value: false },
                      { label: 'Team', value: true },
                    ].map((option) => {
                      const selected = usingTeams === option.value;
                      return (
                        <Pressable
                          key={option.label}
                          onPress={() => setUsingTeams(option.value)}
                          style={[
                            styles.segment,
                            { backgroundColor: selected ? Primary : theme.backgroundElement },
                          ]}>
                          <ThemedText type="smallBold" style={{ color: selected ? '#ffffff' : theme.text }}>
                            {option.label}
                          </ThemedText>
                        </Pressable>
                      );
                    })}
                  </View>
                </Field>

                {usingTeams && (
                  <>
                    <Field label="Maximum number of teams" error={errors.numberOfTeams}>
                      <TextInput
                        value={numberOfTeams}
                        onChangeText={(value) => {
                          setNumberOfTeams(value.replace(/[^0-9]/g, ''));
                          setErrors((prev) => ({ ...prev, numberOfTeams: '' }));
                        }}
                        keyboardType="number-pad"
                        style={[styles.input, { color: theme.text, borderColor: errors.numberOfTeams ? theme.error : theme.border }]}
                      />
                    </Field>
                    <Field label="Max team size" error={errors.maxTeamSize}>
                      <TextInput
                        value={maxTeamSize}
                        onChangeText={(value) => {
                          setMaxTeamSize(value.replace(/[^0-9]/g, ''));
                          setErrors((prev) => ({ ...prev, maxTeamSize: '' }));
                        }}
                        keyboardType="number-pad"
                        style={[styles.input, { color: theme.text, borderColor: errors.maxTeamSize ? theme.error : theme.border }]}
                      />
                    </Field>
                    <Field label="Team switch password (optional)" error={errors.teamPassword}>
                      <TextInput
                        value={teamPassword}
                        onChangeText={(value) => {
                          setTeamPassword(value);
                          setErrors((prev) => ({ ...prev, teamPassword: '' }));
                        }}
                        autoCapitalize="none"
                        style={[styles.input, { color: theme.text, borderColor: errors.teamPassword ? theme.error : theme.border }]}
                      />
                    </Field>
                  </>
                )}

                <Field label="Due date (YYYY-MM-DD HH:MM)" error={errors.dueDate}>
                  <TextInput
                    value={dueText}
                    onChangeText={(value) => {
                      setDueText(value);
                      setErrors((prev) => ({ ...prev, dueDate: '' }));
                    }}
                    style={[styles.input, { color: theme.text, borderColor: errors.dueDate ? theme.error : theme.border }]}
                  />
                </Field>

                <Field label="Time Zone">
                  <Pressable
                    onPress={() => setOpenMenu(openMenu === 'timeZone' ? null : 'timeZone')}
                    style={[styles.dropdownTrigger, { borderColor: theme.border }]}
                    aria-label="addTaskTimeZoneDropdown">
                    <ThemedText type="small">{selectedTimeZone?.label ?? 'Select a time zone'}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {openMenu === 'timeZone' ? '▲' : '▼'}
                    </ThemedText>
                  </Pressable>
                  {openMenu === 'timeZone' && (
                    <View style={[styles.dropdownMenu, { borderColor: theme.border }]}>
                      {TIME_ZONES.map((zone) => (
                        <Pressable
                          key={zone.value}
                          onPress={() => {
                            setTimeZone(zone.value);
                            setOpenMenu(null);
                          }}
                          style={styles.option}>
                          <ThemedText type={zone.value === timeZone ? 'smallBold' : 'small'}>{zone.label}</ThemedText>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </Field>

                <View style={styles.switchRow}>
                  <ThemedText type="small">Show suggestions for improvement</ThemedText>
                  <Switch value={showSuggestions} onValueChange={setShowSuggestions} />
                </View>
                <View style={styles.switchRow}>
                  <ThemedText type="small">Show ratings</ThemedText>
                  <Switch value={showRatings} onValueChange={setShowRatings} />
                </View>

                <Field label="Instructions for students and TAs" error={errors.notes}>
                  <TextInput
                    value={notes}
                    onChangeText={(value) => {
                      setNotes(value);
                      setErrors((prev) => ({ ...prev, notes: '' }));
                    }}
                    multiline
                    textAlignVertical="top"
                    style={[styles.input, styles.notesInput, { color: theme.text, borderColor: errors.notes ? theme.error : theme.border }]}
                  />
                </Field>

                {!!submitError && (
                  <ThemedText type="small" themeColor="error">
                    {submitError}
                  </ThemedText>
                )}

                <View style={styles.actionRow}>
                  <Pressable onPress={() => router.back()} style={styles.cancelButton} aria-label="cancelAddTaskButton">
                    <ThemedText type="smallBold" style={{ color: Primary }}>
                      Cancel
                    </ThemedText>
                  </Pressable>
                  <Pressable
                    onPress={handleCreate}
                    disabled={isSubmitting}
                    style={({ pressed }) => [styles.createButton, { opacity: pressed || isSubmitting ? 0.8 : 1 }]}
                    aria-label="createAssessmentTaskButton">
                    {isSubmitting ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <ThemedText type="smallBold" style={styles.createLabel}>
                        Create Task
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

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <View style={styles.field}>
      <ThemedText type="smallBold">{label}</ThemedText>
      {children}
      {!!error && (
        <ThemedText type="small" themeColor="error">
          {error}
        </ThemedText>
      )}
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
    gap: Spacing.three,
  },
  field: {
    gap: Spacing.one,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 15,
  },
  notesInput: {
    minHeight: 96,
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
    borderWidth: 1,
    borderRadius: Spacing.two,
    overflow: 'hidden',
  },
  option: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  segment: {
    flex: 1,
    borderRadius: Spacing.two,
    paddingVertical: Spacing.two,
    alignItems: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  cancelButton: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  createButton: {
    minWidth: 140,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Primary,
  },
  createLabel: {
    color: '#ffffff',
  },
});
