import { router, Stack, useLocalSearchParams } from 'expo-router';
import { type ReactNode, useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  createCustomRubric,
  deleteCustomRubric,
  getRubricForEdit,
  listRubricPickerData,
  type Rubric,
  type RubricCategory,
  updateCustomRubric,
} from '@/api/rubrics';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Primary, Spacing } from '@/constants/theme';
import { useSession } from '@/context/session';
import { useApi } from '@/hooks/use-api';
import { useTheme } from '@/hooks/use-theme';

interface FormErrors {
  name: string;
  description: string;
  categories: string;
}

const NO_ERRORS: FormErrors = { name: '', description: '', categories: '' };

export default function AddCustomRubricScreen() {
  const { rubricId } = useLocalSearchParams<{ rubricId?: string }>();
  const isEdit = !!rubricId;
  const theme = useTheme();
  const { session } = useSession();
  const request = useApi();

  const [rubrics, setRubrics] = useState<Rubric[] | null>(null);
  const [categories, setCategories] = useState<RubricCategory[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [expandedRubricId, setExpandedRubricId] = useState<number | null>(null);

  const [errors, setErrors] = useState<FormErrors>(NO_ERRORS);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadPickerData = useCallback(async () => {
    const result = await listRubricPickerData(request);
    if (!result.ok) {
      setLoadError(result.errorMessage);
      return;
    }
    if (isEdit) {
      const existing = await getRubricForEdit(request, rubricId!);
      if (!existing.ok) {
        setLoadError(existing.errorMessage);
        return;
      }
      setName(existing.data.rubric_name);
      setDescription(existing.data.rubric_description);
      setSelectedIds(existing.data.categoryIds);
    }
    setRubrics(result.data.rubrics);
    setCategories(result.data.categories);
    setLoadError(null);
  }, [request, isEdit, rubricId]);

  useEffect(() => {
    loadPickerData();
  }, [loadPickerData]);

  const toggleCategory = (categoryId: number) => {
    setSelectedIds((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
    setErrors((prev) => ({ ...prev, categories: '' }));
  };

  const handleDelete = () => {
    Alert.alert('Delete rubric', `Delete "${name}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const result = await deleteCustomRubric(request, rubricId!);
          if (result.ok) {
            router.back();
          } else {
            Alert.alert('Could not delete rubric', result.errorMessage);
          }
        },
      },
    ]);
  };

  const handleCreate = async () => {
    const nextErrors: FormErrors = {
      name: name.trim() === '' ? 'Rubric name cannot be empty' : '',
      description: description.trim() === '' ? 'Rubric description cannot be empty' : '',
      categories: selectedIds.length === 0 ? 'Select at least one category' : '',
    };
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.description || nextErrors.categories || !session) return;

    setSubmitError(null);
    setIsSubmitting(true);
    const result = isEdit
      ? await updateCustomRubric(request, rubricId!, session.user.user_id, name.trim(), description.trim(), selectedIds)
      : await createCustomRubric(request, session.user.user_id, name.trim(), description.trim(), selectedIds);
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
        <Stack.Screen options={{ title: isEdit ? 'Edit Your Rubric' : 'Add Custom Rubric' }} />
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
              <Pressable onPress={loadPickerData} style={styles.textButton}>
                <ThemedText type="linkPrimary">Retry</ThemedText>
              </Pressable>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
              <ThemedView type="backgroundElement" style={[styles.card, { borderColor: theme.border }]}>
                <ThemedText type="subtitle" style={{ color: Primary }}>
                  {isEdit ? 'Edit Your Rubric' : 'Add Custom Rubric'}
                </ThemedText>

                <Field label="Rubric Name" error={errors.name}>
                  <TextInput
                    value={name}
                    onChangeText={(value) => {
                      setName(value);
                      setErrors((prev) => ({ ...prev, name: '' }));
                    }}
                    aria-label="customRubricNameInput"
                    style={[styles.input, { color: theme.text, borderColor: errors.name ? theme.error : theme.border }]}
                  />
                </Field>

                <Field label="Rubric Description" error={errors.description}>
                  <TextInput
                    value={description}
                    onChangeText={(value) => {
                      setDescription(value);
                      setErrors((prev) => ({ ...prev, description: '' }));
                    }}
                    multiline
                    textAlignVertical="top"
                    aria-label="customRubricDescriptionInput"
                    style={[
                      styles.input,
                      styles.descriptionInput,
                      { color: theme.text, borderColor: errors.description ? theme.error : theme.border },
                    ]}
                  />
                </Field>

                <Field label={`Categories (${selectedIds.length} selected)`} error={errors.categories}>
                  <View style={[styles.pickerBlock, { borderColor: theme.border }]}>
                    {rubrics!.map((rubric, index) => {
                      const rubricCategories = categories!.filter((category) => category.rubric_id === rubric.rubric_id);
                      const expanded = expandedRubricId === rubric.rubric_id;
                      return (
                        <View key={rubric.rubric_id}>
                          {index > 0 && <View style={[styles.separator, { backgroundColor: theme.border }]} />}
                          <Pressable
                            onPress={() => setExpandedRubricId(expanded ? null : rubric.rubric_id)}
                            style={styles.rubricHeader}
                            aria-label={`pickerRubric${rubric.rubric_id}`}>
                            <ThemedText type="smallBold">{rubric.rubric_name}</ThemedText>
                            <ThemedText type="small" themeColor="textSecondary">
                              {expanded ? '▲' : '▼'}
                            </ThemedText>
                          </Pressable>
                          {expanded &&
                            rubricCategories.map((category) => {
                              const checked = selectedIds.includes(category.category_id);
                              return (
                                <Pressable
                                  key={category.category_id}
                                  onPress={() => toggleCategory(category.category_id)}
                                  style={styles.categoryRow}
                                  aria-label={`pickCategory${category.category_id}`}>
                                  <View style={[styles.checkbox, { borderColor: theme.border }, checked && { backgroundColor: Primary, borderColor: Primary }]}>
                                    {checked && <ThemedText type="smallBold" style={styles.checkMark}>✓</ThemedText>}
                                  </View>
                                  <ThemedText type="small" style={styles.categoryName}>
                                    {category.category_name}
                                  </ThemedText>
                                </Pressable>
                              );
                            })}
                        </View>
                      );
                    })}
                  </View>
                </Field>

                {!!submitError && (
                  <ThemedText type="small" themeColor="error">
                    {submitError}
                  </ThemedText>
                )}

                <View style={styles.actionRow}>
                  {isEdit ? (
                    <Pressable onPress={handleDelete} style={styles.deleteButton} aria-label="deleteCustomRubricButton">
                      <ThemedText type="smallBold" themeColor="error">
                        Delete
                      </ThemedText>
                    </Pressable>
                  ) : (
                    <View />
                  )}
                  <View style={styles.primaryActions}>
                  <Pressable onPress={() => router.back()} style={styles.cancelButton} aria-label="cancelAddCustomRubricButton">
                    <ThemedText type="smallBold" style={{ color: Primary }}>
                      Cancel
                    </ThemedText>
                  </Pressable>
                  <Pressable
                    onPress={handleCreate}
                    disabled={isSubmitting}
                    style={({ pressed }) => [styles.createButton, { opacity: pressed || isSubmitting ? 0.8 : 1 }]}
                    aria-label="createCustomRubricButton">
                    {isSubmitting ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <ThemedText type="smallBold" style={styles.createLabel}>
                        {isEdit ? 'Update Rubric' : 'Create Rubric'}
                      </ThemedText>
                    )}
                  </Pressable>
                  </View>
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
  descriptionInput: {
    minHeight: 80,
  },
  pickerBlock: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Spacing.two,
    overflow: 'hidden',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
  },
  rubricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    color: '#ffffff',
    fontSize: 13,
  },
  categoryName: {
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  primaryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  deleteButton: {
    paddingVertical: Spacing.three,
  },
  cancelButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  createButton: {
    minWidth: 120,
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
