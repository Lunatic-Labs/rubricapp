import React, { useState } from 'react';
import { Box, Button, Collapse, IconButton, Paper } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { GraphItem } from './AdminExportGraphComparison';

interface ComparisonDrawerProps {
  selectedGraphItems: GraphItem[];
  onClearSelection: () => void;
  onExport: () => void;
}

const MAX_COMPARISON_SLOTS = 4;

const ComparisonDrawer: React.FC<ComparisonDrawerProps> = ({
  selectedGraphItems,
  onClearSelection,
  onExport,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const getSlotLabel = (item: GraphItem) => {
    if (item.graph_type === 'distribution') {
      return (
        <>
          {item.assessment_task_name}
          <br />
          Distribution
        </>
      );
    }

    const typeShort = item.graph_type === 'characteristics' ? 'Char.' : 'Impr.';
    return (
      <>
        {item.category_name}
        <br />
        {typeShort}
      </>
    );
  };

  const slotsToShow = Math.min(selectedGraphItems.length, MAX_COMPARISON_SLOTS);
  const emptySlots = MAX_COMPARISON_SLOTS - slotsToShow;

  return (
    <Paper className="comparison-drawer" elevation={8}>
      {/* Drawer Header */}
      <Box className="drawer-header" onClick={toggleExpanded}>
        <Box className="drawer-title">
          <h5>Comparison Preview</h5>
          <Box
            sx={{
              backgroundColor: '#2E8BEF',
              color: '#fff',
              padding: '2px 10px',
              borderRadius: '12px',
              fontSize: '0.8rem',
              fontWeight: 500,
              marginLeft: '12px',
            }}
          >
            {slotsToShow} of {MAX_COMPARISON_SLOTS}
          </Box>
        </Box>
        <IconButton size="small">
          {isExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </IconButton>
      </Box>

      {/* Drawer Content */}
      <Collapse in={isExpanded}>
        <Box className="drawer-content">
          {/* Comparison Grid - 4 slots */}
          <Box className="comparison-grid">
            {/* Filled slots */}
            {selectedGraphItems.slice(0, MAX_COMPARISON_SLOTS).map((item) => (
              <Box key={item.id} className="comparison-slot filled">
                <Box className="slot-label">{getSlotLabel(item)}</Box>
              </Box>
            ))}

            {/* Empty slots */}
            {Array.from({ length: emptySlots }).map((_, index) => (
              <Box key={`empty-${index}`} className="comparison-slot">
                <span>Empty Slot</span>
              </Box>
            ))}
          </Box>

          {/* Drawer Actions */}
          <Box className="drawer-actions">
            <Button variant="outlined" onClick={onClearSelection}>
              Clear Selection
            </Button>
            <Button
              variant="contained"
              startIcon={<OpenInFullIcon />}
              onClick={onExport}
              disabled={selectedGraphItems.length === 0}
            >
              Export Preview
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default ComparisonDrawer;
