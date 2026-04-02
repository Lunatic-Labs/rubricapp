// Shared constants and utility functions for ExportGraphComparison feature

// Graph type display labels - used across GraphCard, ComparisonDrawer, FilterPanel, AdminExportGraphComparison
export const GRAPH_TYPE_LABELS: { [key: string]: string } = {
  distribution: 'Rating Distribution',
  characteristics: 'Observable Characteristics',
  improvements: 'Suggestions for Improvement',
};

// Short labels for filter ribbon display
export const GRAPH_TYPE_SHORT_LABELS: { [key: string]: string } = {
  distribution: 'Distribution',
  characteristics: 'Characteristics',
  improvements: 'Improvements',
};

// Placeholder colors for lazy-loaded graph cards
export const GRAPH_PLACEHOLDER_COLORS: { [key: string]: string } = {
  distribution: '#e3f0fc',
  characteristics: '#e8f5e9',
  improvements: '#ffebee',
};

// Bar colors for each graph type
export const GRAPH_BAR_COLORS: { [key: string]: string } = {
  distribution: '#2e8bef',
  characteristics: '#4CAF50',
  improvements: '#E53935',
};

// Truncate long text for bar chart labels
export const truncateLabel = (text: string, maxLen: number = 18): string => {
  return text.length > maxLen ? text.substring(0, maxLen) + '...' : text;
};

// Format a date string for display
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
