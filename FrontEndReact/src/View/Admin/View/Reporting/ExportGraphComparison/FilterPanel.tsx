import React from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Link,
} from '@mui/material';

export interface FilterState {
  dateStart: string;
  dateEnd: string;
  assessmentTaskIds: string[];
  categoryIds: string[];
  rubricIds: string[];
  teamIds: string[];
  studentIds: string[];
  graphTypes: string[];
}

interface FilterPanelProps {
  filters: FilterState;
  assessmentTasks: any[];
  categories: any[];
  rubrics: any[];
  teams: any[];
  students: any[];
  onFilterChange: (key: keyof FilterState, value: string | string[]) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  assessmentTasks,
  categories,
  rubrics,
  teams,
  students,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
}) => {
  // Handle multiselect change
  const handleMultiSelectChange = (key: keyof FilterState) => (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    // On autofill we get a stringified value
    onFilterChange(key, typeof value === 'string' ? value.split(',') : value);
  };

  // Get display text for multiselect
  const getMultiSelectDisplayText = (selectedIds: string[], items: any[], idKey: string, nameKey: string) => {
    if (selectedIds.length === 0) return '';
    const selectedItems = items.filter((item) => selectedIds.includes(item[idKey]?.toString()));
    return selectedItems.map((item) => item[nameKey]).join(', ');
  };

  return (
    <Paper className="filter-panel">
      {/* Row 1: Date Range and Assessment Tasks */}
      <Box className="filter-row" sx={{ marginBottom: 2 }}>
        {/* Date Range */}
        <Box className="filter-item date-range">
          <InputLabel shrink className="filter-label">
            Date Range
          </InputLabel>
          <Box className="date-inputs">
            <TextField
              type="date"
              size="small"
              value={filters.dateStart}
              onChange={(e) => onFilterChange('dateStart', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              type="date"
              size="small"
              value={filters.dateEnd}
              onChange={(e) => onFilterChange('dateEnd', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </Box>

        {/* Assessment Tasks (Multiselect) */}
        <Box className="filter-item" sx={{ minWidth: 200 }}>
          <FormControl size="small" fullWidth>
            <InputLabel>Assessment Tasks</InputLabel>
            <Select
              multiple
              value={filters.assessmentTaskIds}
              onChange={handleMultiSelectChange('assessmentTaskIds')}
              input={<OutlinedInput label="Assessment Tasks" />}
              renderValue={(selected) =>
                getMultiSelectDisplayText(selected, assessmentTasks, 'assessment_task_id', 'assessment_task_name')
              }
              MenuProps={MenuProps}
            >
              {assessmentTasks.map((task: any) => (
                <MenuItem key={task.assessment_task_id} value={task.assessment_task_id.toString()}>
                  <Checkbox checked={filters.assessmentTaskIds.includes(task.assessment_task_id.toString())} />
                  <ListItemText primary={task.assessment_task_name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Rubric (Multiselect) */}
        <Box className="filter-item" sx={{ minWidth: 180 }}>
          <FormControl size="small" fullWidth>
            <InputLabel>Rubric</InputLabel>
            <Select
              multiple
              value={filters.rubricIds}
              onChange={handleMultiSelectChange('rubricIds')}
              input={<OutlinedInput label="Rubric" />}
              renderValue={(selected) =>
                getMultiSelectDisplayText(selected, rubrics, 'rubric_id', 'rubric_name')
              }
              MenuProps={MenuProps}
            >
              {rubrics.map((rubric: any) => (
                <MenuItem key={rubric.rubric_id} value={rubric.rubric_id.toString()}>
                  <Checkbox checked={filters.rubricIds.includes(rubric.rubric_id.toString())} />
                  <ListItemText primary={rubric.rubric_name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Graph Type (Multiselect) */}
        <Box className="filter-item" sx={{ minWidth: 200 }}>
          <FormControl size="small" fullWidth>
            <InputLabel>Graph Type</InputLabel>
            <Select
              multiple
              value={filters.graphTypes}
              onChange={handleMultiSelectChange('graphTypes')}
              input={<OutlinedInput label="Graph Type" />}
              renderValue={(selected) => {
                const typeLabels: { [key: string]: string } = {
                  distribution: 'Rating Distribution',
                  characteristics: 'Observable Characteristics',
                  improvements: 'Suggestions for Improvement',
                };
                return selected.map((v) => typeLabels[v] || v).join(', ');
              }}
              MenuProps={MenuProps}
            >
              <MenuItem value="distribution">
                <Checkbox checked={filters.graphTypes.includes('distribution')} />
                <ListItemText primary="Rating Distribution" />
              </MenuItem>
              <MenuItem value="characteristics">
                <Checkbox checked={filters.graphTypes.includes('characteristics')} />
                <ListItemText primary="Observable Characteristics" />
              </MenuItem>
              <MenuItem value="improvements">
                <Checkbox checked={filters.graphTypes.includes('improvements')} />
                <ListItemText primary="Suggestions for Improvement" />
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Row 2: Category, Team, Student, Actions */}
      <Box className="filter-row">
        {/* Category/Skill (Multiselect) */}
        <Box className="filter-item" sx={{ minWidth: 200 }}>
          <FormControl size="small" fullWidth>
            <InputLabel>Skill / Category</InputLabel>
            <Select
              multiple
              value={filters.categoryIds}
              onChange={handleMultiSelectChange('categoryIds')}
              input={<OutlinedInput label="Skill / Category" />}
              renderValue={(selected) =>
                getMultiSelectDisplayText(selected, categories, 'category_id', 'category_name')
              }
              MenuProps={MenuProps}
            >
              {categories.map((category: any) => (
                <MenuItem key={category.category_id} value={category.category_id.toString()}>
                  <Checkbox checked={filters.categoryIds.includes(category.category_id.toString())} />
                  <ListItemText primary={category.category_name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Team (Multiselect) */}
        <Box className="filter-item" sx={{ minWidth: 180 }}>
          <FormControl size="small" fullWidth>
            <InputLabel>Team</InputLabel>
            <Select
              multiple
              value={filters.teamIds}
              onChange={handleMultiSelectChange('teamIds')}
              input={<OutlinedInput label="Team" />}
              renderValue={(selected) =>
                getMultiSelectDisplayText(selected, teams, 'team_id', 'team_name')
              }
              MenuProps={MenuProps}
            >
              {teams.map((team: any) => (
                <MenuItem key={team.team_id} value={team.team_id.toString()}>
                  <Checkbox checked={filters.teamIds.includes(team.team_id.toString())} />
                  <ListItemText primary={team.team_name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Student (Multiselect) */}
        <Box className="filter-item" sx={{ minWidth: 200 }}>
          <FormControl size="small" fullWidth>
            <InputLabel>Student</InputLabel>
            <Select
              multiple
              value={filters.studentIds}
              onChange={handleMultiSelectChange('studentIds')}
              input={<OutlinedInput label="Student" />}
              renderValue={(selected) => {
                if (selected.length === 0) return '';
                const specialLabels: { [key: string]: string } = {
                  'all': 'All Students',
                  'class_average': 'Class Average',
                };
                const labels = selected.map((id) => {
                  if (specialLabels[id]) return specialLabels[id];
                  const student = students.find((s: any) => s.user_id?.toString() === id);
                  return student ? (student.full_name || `${student.first_name} ${student.last_name}`) : id;
                });
                return labels.join(', ');
              }}
              MenuProps={MenuProps}
            >
              <MenuItem value="all">
                <Checkbox checked={filters.studentIds.includes('all')} />
                <ListItemText primary="All Students" />
              </MenuItem>
              <MenuItem value="class_average">
                <Checkbox checked={filters.studentIds.includes('class_average')} />
                <ListItemText primary="Class Average" />
              </MenuItem>
              {students.map((student: any) => (
                <MenuItem key={student.user_id} value={student.user_id.toString()}>
                  <Checkbox checked={filters.studentIds.includes(student.user_id.toString())} />
                  <ListItemText primary={student.full_name || `${student.first_name} ${student.last_name}`} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Filter Actions */}
        <Box className="filter-actions">
          <Link
            component="button"
            variant="body2"
            onClick={onClearFilters}
            className="clear-link"
          >
            Clear All
          </Link>
          <Button variant="contained" onClick={onApplyFilters}>
            Apply
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default FilterPanel;
