import React, { useCallback } from 'react';
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
import { GRAPH_TYPE_LABELS } from './graphConstants';

export interface FilterState {
  dateStart: string;
  dateEnd: string;
  assessmentTaskIds: string[];
  rubricIds: string[];
  teamIds: string[];      // kept for future use
  studentIds: string[];   // kept for future use
  graphTypes: string[];
}

interface FilterPanelProps {
  filters: FilterState;
  assessmentTasks: any[];
  rubrics: any[];
  teams: any[];       // kept for future use
  students: any[];    // kept for future use
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
  rubrics,
  teams,
  students,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
}) => {
  // Handle multiselect change - useCallback since onFilterChange is a stable class method
  const handleMultiSelectChange = useCallback(
    (key: keyof FilterState) => (event: SelectChangeEvent<string[]>) => {
      const value = event.target.value;
      onFilterChange(key, typeof value === 'string' ? value.split(',') : value);
    },
    [onFilterChange]
  );

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
              renderValue={(selected) =>
                selected.map((v) => GRAPH_TYPE_LABELS[v] || v).join(', ')
              }
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

      {/* Row 2: Actions */}
      <Box className="filter-row">
        {/* Team (Multiselect) - commented out for now
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
        */}

        {/* Student (Multiselect) - commented out for now
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
        */}

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

export default React.memo(FilterPanel);
