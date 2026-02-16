import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Cookies from 'universal-cookie';
import ErrorMessage from '../../../../Error/ErrorMessage';
import Loading from '../../../../Loading/Loading';
import { apiUrl } from '../../../../../App';
import { genericResourceGET } from '../../../../../utility';
import { Box, Button, Chip, Collapse, Snackbar, Alert, CircularProgress } from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import GraphCard from './GraphCard';
import FilterPanel, { FilterState } from './FilterPanel';
import ComparisonDrawer from './ComparisonDrawer';
import './ExportGraphComparison.css';

// Interface for a graph item (generated from completed assessment data)
export interface GraphItem {
  id: string; // Unique identifier for the graph
  assessment_task_id: number;
  assessment_task_name: string;
  graph_type: 'distribution' | 'characteristics' | 'improvements';
  category_id: number | null;
  category_name: string;
  rubric_id: number;
  rubric_name: string;
  team_id: number | null;
  team_name: string | null;
  student_id: number | null;
  student_name: string | null;
  due_date: string;
  total_assessments: number;
  graph_data: any;
}

// Interface for active filter display
interface ActiveFilter {
  key: string;
  label: string;
}

// Interface for component state
interface AdminExportGraphComparisonState {
  errorMessage: string | null;
  isLoaded: boolean;
  graphItems: GraphItem[];
  selectedGraphIds: Set<string>;
  filterPanelOpen: boolean;
  filters: FilterState;
  activeFilters: ActiveFilter[];
  categories: any[];
  rubrics: any[];
  teams: any[];
  students: any[];
  toastOpen: boolean;
  toastMessage: string;
  toastSeverity: 'success' | 'info' | 'warning' | 'error';
  exporting: boolean;
}

class AdminExportGraphComparison extends Component<any, AdminExportGraphComparisonState> {
  constructor(props: any) {
    super(props);

    this.state = {
      errorMessage: null,
      isLoaded: false,
      graphItems: [],
      selectedGraphIds: new Set(),
      filterPanelOpen: true,
      filters: {
        dateStart: '',
        dateEnd: '',
        assessmentTaskIds: [],
        categoryIds: [],
        rubricIds: [],
        teamIds: [],
        studentIds: [],
        graphTypes: [],
      },
      activeFilters: [],
      categories: [],
      rubrics: [],
      teams: [],
      students: [],
      toastOpen: false,
      toastMessage: '',
      toastSeverity: 'info',
      exporting: false,
    };
  }

  componentDidMount() {
    this.fetchAllData();
  }

  fetchAllData = () => {
    // Fetch categories, rubrics, teams, students for filter dropdowns
    // Then generate graph items from completed assessments
    this.fetchCategories();
    this.fetchRubrics();
    this.fetchTeams();
    this.fetchStudents();
    this.generateGraphItems();
  };

  fetchCategories = () => {
    // Fetch all categories (they're linked to rubrics via RubricCategory)
    genericResourceGET(`/category`, "categories", this);
  };

  fetchRubrics = () => {
    // Fetch all rubrics so the filter dropdown is populated
    genericResourceGET(`/rubric?all=${true}`, "rubrics", this);
  };

  fetchTeams = () => {
    const chosenCourse = this.props.navbar?.state?.chosenCourse;
    if (chosenCourse) {
      genericResourceGET(
        `/team?course_id=${chosenCourse["course_id"]}`,
        "teams",
        this
      );
    }
  };

  fetchStudents = () => {
    const chosenCourse = this.props.navbar?.state?.chosenCourse;
    if (chosenCourse) {
      // role_id=5 is for students
      genericResourceGET(
        `/user?course_id=${chosenCourse["course_id"]}&role_id=5`,
        "users",
        this,
        { dest: 'students' }
      );
    }
  };

  generateGraphItems = async () => {
    const assessmentTasks = this.props.assessmentTasks || [];
    const chosenCourse = this.props.navbar?.state?.chosenCourse;

    if (!chosenCourse || assessmentTasks.length === 0) {
      this.setState({ graphItems: [], isLoaded: true });
      return;
    }

    const cookies = new Cookies();
    const accessToken = cookies.get('access_token');
    const user = cookies.get('user');
    const headers = { 'Authorization': 'Bearer ' + accessToken, 'Content-Type': 'application/json' };

    // Get unique rubric IDs from assessment tasks
    const uniqueRubricIds = [...new Set(assessmentTasks.map((t: any) => t.rubric_id))];

    try {
      // Fetch rubric details (with category_json) and completed assessments in parallel
      const rubricPromises = uniqueRubricIds.map((rubricId) =>
        fetch(`${apiUrl}/rubric?rubric_id=${rubricId}&user_id=${user.user_id}`, { headers })
          .then((r) => r.json())
      );

      const completedPromises = assessmentTasks.map((task: any) =>
        fetch(
          `${apiUrl}/completed_assessment?admin_id=${chosenCourse.admin_id}&assessment_task_id=${task.assessment_task_id}&user_id=${user.user_id}`,
          { headers }
        ).then((r) => r.json())
      );

      const [rubricResults, completedResults] = await Promise.all([
        Promise.all(rubricPromises),
        Promise.all(completedPromises),
      ]);

      // Build rubric map: rubric_id -> rubric data (with category_json)
      const rubricMap: { [key: number]: any } = {};
      rubricResults.forEach((result) => {
        if (result.success && result.content?.rubrics) {
          const rubric = result.content.rubrics[0];
          rubricMap[rubric.rubric_id] = rubric;
        }
      });

      const graphItems: GraphItem[] = [];

      // Process each assessment task
      assessmentTasks.forEach((task: any, taskIndex: number) => {
        const completedResult = completedResults[taskIndex];
        if (!completedResult.success) return;

        const completedAssessments = completedResult.content?.completed_assessments?.[0] || [];
        const rubric = rubricMap[task.rubric_id];
        if (!rubric || !rubric.category_json) return;

        const categoryJson = rubric.category_json;
        const categoryNames = Object.keys(categoryJson).sort(
          (a, b) => categoryJson[a].index - categoryJson[b].index
        );

        // Only process completed (done) assessments
        const doneAssessments = completedAssessments.filter((ca: any) => ca.done);
        const totalDone = doneAssessments.length;

        // For each category, build distribution + characteristics + improvements graphs
        categoryNames.forEach((categoryName) => {
          const catData = categoryJson[categoryName];

          // Initialize rating distribution
          const ratingsData = [
            { rating: 0, number: 0 }, { rating: 1, number: 0 },
            { rating: 2, number: 0 }, { rating: 3, number: 0 },
            { rating: 4, number: 0 }, { rating: 5, number: 0 },
          ];

          // Initialize characteristics and improvements from rubric text labels
          const characteristicsData = catData.observable_characteristics.map((text: string) => ({
            characteristic: text,
            number: 0,
            percentage: 0,
          }));

          const improvementsData = catData.suggestions.map((text: string) => ({
            improvement: text,
            number: 0,
            percentage: 0,
          }));

          const allRatings: number[] = [];

          // Aggregate data from completed assessments (same logic as ViewAssessmentStatus)
          doneAssessments.forEach((ca: any) => {
            const rocs = ca.rating_observable_characteristics_suggestions_data;
            if (!rocs || !rocs[categoryName]) return;

            const catRocs = rocs[categoryName];

            // Rating
            const rating = catRocs.rating;
            allRatings.push(rating);
            const ratingEntry = ratingsData[rating];
            if (ratingEntry) {
              ratingEntry.number += 1;
            }

            // Observable characteristics (binary string of 0/1)
            for (let j = 0; j < catRocs.observable_characteristics.length; j++) {
              if (characteristicsData[j]) {
                characteristicsData[j].number += parseInt(catRocs.observable_characteristics[j]);
              }
            }

            // Suggestions (binary string of 0/1)
            for (let j = 0; j < catRocs.suggestions.length; j++) {
              if (improvementsData[j]) {
                improvementsData[j].number += parseInt(catRocs.suggestions[j]);
              }
            }
          });

          // Calculate percentages
          characteristicsData.forEach((item: any) => {
            item.percentage = totalDone === 0 ? 0 : +((item.number / totalDone) * 100).toFixed(2);
          });
          improvementsData.forEach((item: any) => {
            item.percentage = totalDone === 0 ? 0 : +((item.number / totalDone) * 100).toFixed(2);
          });

          // Calculate avg and stdev
          let avg = 0;
          let stdev = 0;
          if (allRatings.length > 0) {
            avg = +(allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(2);
            stdev = +(
              Math.sqrt(allRatings.map((x) => (x - avg) ** 2).reduce((a, b) => a + b, 0) / allRatings.length)
            ).toFixed(2);
          }

          // Common fields for all graph types from this task+category
          const baseFields = {
            assessment_task_id: task.assessment_task_id,
            assessment_task_name: task.assessment_task_name,
            category_id: null as number | null,
            category_name: categoryName,
            rubric_id: task.rubric_id,
            rubric_name: rubric.rubric_name,
            team_id: null as number | null,
            team_name: null as string | null,
            student_id: null as number | null,
            student_name: null as string | null,
            due_date: task.due_date,
            total_assessments: totalDone,
          };

          // Distribution graph
          graphItems.push({
            ...baseFields,
            id: `dist-${task.assessment_task_id}-${categoryName}`,
            graph_type: 'distribution',
            graph_data: { ratings: ratingsData, avg, stdev },
          });

          // Characteristics graph (only if rubric has observable characteristics)
          if (characteristicsData.length > 0) {
            graphItems.push({
              ...baseFields,
              id: `char-${task.assessment_task_id}-${categoryName}`,
              graph_type: 'characteristics',
              graph_data: { characteristics: characteristicsData },
            });
          }

          // Improvements graph (only if rubric has suggestions)
          if (improvementsData.length > 0) {
            graphItems.push({
              ...baseFields,
              id: `impr-${task.assessment_task_id}-${categoryName}`,
              graph_type: 'improvements',
              graph_data: { improvements: improvementsData },
            });
          }
        });
      });

      this.setState({ graphItems, isLoaded: true });
    } catch (error) {
      console.error('Error generating graph items:', error);
      this.setState({
        errorMessage: 'Failed to load graph data. Please try again.',
        isLoaded: true,
      });
    }
  };

  handleGraphSelect = (graphId: string) => {
    this.setState((prevState) => {
      const newSelected = new Set(prevState.selectedGraphIds);
      if (newSelected.has(graphId)) {
        newSelected.delete(graphId);
      } else {
        newSelected.add(graphId);
      }
      return { selectedGraphIds: newSelected };
    });
  };

  handleSelectAll = () => {
    const filteredGraphs = this.getFilteredGraphItems();
    const { selectedGraphIds } = this.state;

    if (selectedGraphIds.size === filteredGraphs.length && filteredGraphs.length > 0) {
      // Deselect all
      this.setState({ selectedGraphIds: new Set() });
    } else {
      // Select all filtered graphs
      const allIds = new Set(filteredGraphs.map((g) => g.id));
      this.setState({ selectedGraphIds: allIds });
    }
  };

  handleClearSelection = () => {
    this.setState({ selectedGraphIds: new Set() });
  };

  handleFilterChange = (key: keyof FilterState, value: string | string[]) => {
    this.setState((prevState) => ({
      filters: {
        ...prevState.filters,
        [key]: value,
      },
    }));
  };

  handleApplyFilters = () => {
    const { filters, categories, rubrics, teams, students } = this.state;
    const assessmentTasks = this.props.assessmentTasks || [];
    const activeFilters: ActiveFilter[] = [];

    // Assessment Tasks (multiselect)
    if (filters.assessmentTaskIds.length > 0) {
      const names = assessmentTasks
        .filter((t: any) => filters.assessmentTaskIds.includes(t.assessment_task_id.toString()))
        .map((t: any) => t.assessment_task_name);
      activeFilters.push({ key: 'assessmentTaskIds', label: `Tasks: ${names.join(', ')}` });
    }

    // Categories (multiselect)
    if (filters.categoryIds.length > 0) {
      const names = categories
        .filter((c: any) => filters.categoryIds.includes(c.category_id.toString()))
        .map((c: any) => c.category_name);
      activeFilters.push({ key: 'categoryIds', label: `Skills: ${names.join(', ')}` });
    }

    // Rubrics (multiselect)
    if (filters.rubricIds.length > 0) {
      const names = rubrics
        .filter((r: any) => filters.rubricIds.includes(r.rubric_id.toString()))
        .map((r: any) => r.rubric_name);
      activeFilters.push({ key: 'rubricIds', label: `Rubrics: ${names.join(', ')}` });
    }

    // Teams (multiselect)
    if (filters.teamIds.length > 0) {
      const names = teams
        .filter((t: any) => filters.teamIds.includes(t.team_id.toString()))
        .map((t: any) => t.team_name);
      activeFilters.push({ key: 'teamIds', label: `Teams: ${names.join(', ')}` });
    }

    // Students (multiselect)
    if (filters.studentIds.length > 0) {
      const specialLabels: { [key: string]: string } = {
        'all': 'All Students',
        'class_average': 'Class Average',
      };
      const names = filters.studentIds.map((id) => {
        if (specialLabels[id]) return specialLabels[id];
        const student = students.find((s: any) => s.user_id?.toString() === id);
        return student ? (student.full_name || `${student.first_name} ${student.last_name}`) : id;
      });
      activeFilters.push({ key: 'studentIds', label: `Students: ${names.join(', ')}` });
    }

    // Graph Types (multiselect)
    if (filters.graphTypes.length > 0) {
      const typeLabels: { [key: string]: string } = {
        distribution: 'Distribution',
        characteristics: 'Characteristics',
        improvements: 'Improvements',
      };
      const names = filters.graphTypes.map((t) => typeLabels[t] || t);
      activeFilters.push({ key: 'graphTypes', label: `Types: ${names.join(', ')}` });
    }

    // Date Range
    if (filters.dateStart && filters.dateEnd) {
      activeFilters.push({
        key: 'dateRange',
        label: `Date: ${filters.dateStart} - ${filters.dateEnd}`,
      });
    }

    this.setState({ activeFilters, filterPanelOpen: false });
  };

  handleRemoveFilter = (key: string) => {
    this.setState((prevState) => {
      const newFilters = { ...prevState.filters };

      if (key === 'dateRange') {
        newFilters.dateStart = '';
        newFilters.dateEnd = '';
      } else {
        // Handle array fields (graphTypes, assessmentTaskIds, etc.)
        (newFilters as any)[key] = [];
      }

      return {
        filters: newFilters,
        activeFilters: prevState.activeFilters.filter((f) => f.key !== key),
      };
    });
  };

  handleClearAllFilters = () => {
    this.setState({
      filters: {
        dateStart: '',
        dateEnd: '',
        assessmentTaskIds: [],
        categoryIds: [],
        rubricIds: [],
        teamIds: [],
        studentIds: [],
        graphTypes: [],
      },
      activeFilters: [],
    });
  };

  handleExport = async () => {
    const MAX_EXPORT = 10;
    const { selectedGraphIds } = this.state;
    const count = selectedGraphIds.size;

    if (count === 0) {
      this.showToast('Please select at least one graph to export', 'warning');
      return;
    }

    if (count > MAX_EXPORT) {
      this.showToast(`Please select no more than ${MAX_EXPORT} graphs at a time`, 'warning');
      return;
    }

    this.setState({ exporting: true });
    this.showToast(`Exporting ${count} graph${count !== 1 ? 's' : ''} as PDF...`, 'info');

    // Let the UI update before starting heavy work
    await new Promise((resolve) => setTimeout(resolve, 50));

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'letter',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 30;

      const selectedIds = Array.from(selectedGraphIds);
      let pagesAdded = 0;

      for (let i = 0; i < selectedIds.length; i++) {
        const graphId = selectedIds[i];
        const cardElement = document.querySelector(`[data-graph-id="${graphId}"]`) as HTMLElement | null;
        if (!cardElement) continue;

        // Add a new page for every graph after the first
        if (pagesAdded > 0) {
          pdf.addPage();
        }

        const canvas = await html2canvas(cardElement, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
          imageTimeout: 0,
          onclone: (clonedDoc) => {
            // Remove all other graph cards from the clone for speed
            const allCards = clonedDoc.querySelectorAll('.graph-card');
            allCards.forEach((card) => {
              if (card.getAttribute('data-graph-id') !== graphId) {
                card.remove();
              }
            });
          },
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.92);
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        const availableWidth = pageWidth - margin * 2;
        const availableHeight = pageHeight - margin * 2;
        const ratio = Math.min(availableWidth / imgWidth, availableHeight / imgHeight);
        const scaledWidth = imgWidth * ratio;
        const scaledHeight = imgHeight * ratio;

        // Center horizontally, place near top of page
        const xOffset = (pageWidth - scaledWidth) / 2;
        const yOffset = margin;

        pdf.addImage(imgData, 'JPEG', xOffset, yOffset, scaledWidth, scaledHeight);
        pagesAdded++;
      }

      if (pagesAdded > 0) {
        pdf.save('assessment-graphs-export.pdf');
        this.showToast(`Exported ${pagesAdded} graph${pagesAdded !== 1 ? 's' : ''} successfully!`, 'success');
      } else {
        this.showToast('No graph cards found to export. Try scrolling through the graphs first.', 'warning');
      }
    } catch (error) {
      console.error('Error exporting PDFs:', error);
      this.showToast('Export failed. Please try again.', 'error');
    } finally {
      this.setState({ exporting: false });
    }
  };

  showToast = (message: string, severity: 'success' | 'info' | 'warning' | 'error') => {
    this.setState({
      toastOpen: true,
      toastMessage: message,
      toastSeverity: severity,
    });
  };

  handleToastClose = () => {
    this.setState({ toastOpen: false });
  };

  getFilteredGraphItems = (): GraphItem[] => {
    const { graphItems, filters } = this.state;

    return graphItems.filter((item) => {
      // Assessment Task filter
      if (filters.assessmentTaskIds.length > 0 &&
          !filters.assessmentTaskIds.includes(item.assessment_task_id.toString())) {
        return false;
      }

      // Category filter
      if (filters.categoryIds.length > 0 &&
          item.category_id !== null &&
          !filters.categoryIds.includes(item.category_id.toString())) {
        return false;
      }

      // Rubric filter
      if (filters.rubricIds.length > 0 &&
          !filters.rubricIds.includes(item.rubric_id.toString())) {
        return false;
      }

      // Team filter
      if (filters.teamIds.length > 0 &&
          item.team_id !== null &&
          !filters.teamIds.includes(item.team_id.toString())) {
        return false;
      }

      // Student filter
      if (filters.studentIds.length > 0 &&
          item.student_id !== null &&
          !filters.studentIds.includes(item.student_id.toString())) {
        return false;
      }

      // Graph type filter
      if (filters.graphTypes.length > 0 && !filters.graphTypes.includes(item.graph_type)) {
        return false;
      }

      // Date range filter
      if (filters.dateStart && new Date(item.due_date) < new Date(filters.dateStart)) {
        return false;
      }
      if (filters.dateEnd && new Date(item.due_date) > new Date(filters.dateEnd)) {
        return false;
      }

      return true;
    });
  };

  render() {
    const {
      errorMessage,
      isLoaded,
      selectedGraphIds,
      filterPanelOpen,
      filters,
      activeFilters,
      categories,
      rubrics,
      teams,
      students,
      toastOpen,
      toastMessage,
      toastSeverity,
      exporting,
    } = this.state;

    if (errorMessage) {
      return (
        <Box className="export-graph-container">
          <ErrorMessage errorMessage={errorMessage} />
        </Box>
      );
    }

    if (!isLoaded) {
      return <Loading />;
    }

    const filteredGraphItems = this.getFilteredGraphItems();
    const allSelected = selectedGraphIds.size === filteredGraphItems.length && filteredGraphItems.length > 0;

    return (
      <Box className="export-graph-container">
        {/* Header */}
        <Box className="export-graph-header">
          <Box className="header-title-area">
            <h4>Export Assessment Graphs</h4>
            <p className="selection-info">
              <strong>{selectedGraphIds.size}</strong> of {filteredGraphItems.length} graphs selected
            </p>
          </Box>
          <Box className="header-actions">
            <Button variant="outlined" onClick={this.handleSelectAll}>
              {allSelected ? 'Deselect All' : 'Select All'}
            </Button>
            <Button
              variant="outlined"
              onClick={this.handleClearSelection}
              disabled={selectedGraphIds.size === 0}
            >
              Clear All
            </Button>
            <Button
              variant="contained"
              onClick={this.handleExport}
              disabled={selectedGraphIds.size === 0 || exporting}
              startIcon={exporting ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : undefined}
            >
              {exporting ? 'Exporting...' : 'Export Selected as PDF'}
            </Button>
          </Box>
        </Box>

        {/* Filter Toggle Bar */}
        <Box className="filter-toggle-bar">
          <Box className="active-filters">
            {activeFilters.length > 0 ? (
              activeFilters.map((filter) => (
                <Chip
                  key={filter.key}
                  label={filter.label}
                  onDelete={() => this.handleRemoveFilter(filter.key)}
                  className="filter-chip"
                />
              ))
            ) : (
              <span className="no-filters">No filters applied</span>
            )}
          </Box>
          <Button
            variant="text"
            onClick={() => this.setState({ filterPanelOpen: !filterPanelOpen })}
            endIcon={filterPanelOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            startIcon={<FilterListIcon />}
          >
            {filterPanelOpen ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </Box>

        {/* Collapsible Filter Panel */}
        <Collapse in={filterPanelOpen}>
          <FilterPanel
            filters={filters}
            assessmentTasks={this.props.assessmentTasks || []}
            categories={categories}
            rubrics={rubrics}
            teams={teams}
            students={students}
            onFilterChange={this.handleFilterChange}
            onApplyFilters={this.handleApplyFilters}
            onClearFilters={this.handleClearAllFilters}
          />
        </Collapse>

        {/* Graph Grid */}
        <Box className="graph-grid">
          {filteredGraphItems.map((item) => (
            <GraphCard
              key={item.id}
              graphItem={item}
              isSelected={selectedGraphIds.has(item.id)}
              onSelect={() => this.handleGraphSelect(item.id)}
            />
          ))}
          {filteredGraphItems.length === 0 && (
            <Box className="no-graphs-message">
              <p>No graphs found. Try adjusting your filters or select a different course.</p>
            </Box>
          )}
        </Box>

        {/* Comparison Drawer */}
        <ComparisonDrawer
          selectedGraphItems={filteredGraphItems.filter((g) => selectedGraphIds.has(g.id))}
          onClearSelection={this.handleClearSelection}
        />

        {/* Toast Notification */}
        <Snackbar
          open={toastOpen}
          autoHideDuration={3000}
          onClose={this.handleToastClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={this.handleToastClose} severity={toastSeverity} sx={{ width: '100%' }}>
            {toastMessage}
          </Alert>
        </Snackbar>
      </Box>
    );
  }
}

export default AdminExportGraphComparison;
