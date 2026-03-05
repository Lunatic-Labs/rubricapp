import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, CircularProgress, Collapse, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Paper, TextField } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
} from 'recharts';
import { GraphItem } from './AdminExportGraphComparison';
import { GRAPH_TYPE_LABELS, GRAPH_BAR_COLORS, truncateLabel } from './graphConstants';

interface ComparisonDrawerProps {
  selectedGraphItems: GraphItem[];
  onClearSelection: () => void;
  onRemoveGraph: (graphId: string) => void;
}

const MAX_COMPARISON_SLOTS = 4;

// Static style objects - defined once outside component
const badgeSx = {
  backgroundColor: '#2E8BEF',
  color: '#fff',
  padding: '2px 10px',
  borderRadius: '12px',
  fontSize: '0.8rem',
  fontWeight: 500,
  marginLeft: '12px',
} as const;

const dialogPaperSx = {
  width: '90vw',
  maxWidth: '1200px',
  height: '85vh',
  maxHeight: '900px',
  borderRadius: '12px',
} as const;

const dialogTitleSx = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid #eee',
  pb: 1.5,
} as const;

const percentFormatter = (v: any) => `${v}%`;

const ComparisonDrawer: React.FC<ComparisonDrawerProps> = ({
  selectedGraphItems,
  onClearSelection,
  onRemoveGraph,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [comparisonTitle, setComparisonTitle] = useState('');
  const [orderedItems, setOrderedItems] = useState<GraphItem[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const previewGridRef = useRef<HTMLDivElement>(null);

  // Sync orderedItems when selectedGraphItems changes
  useEffect(() => {
    setOrderedItems((prev) => {
      const selectedIds = new Set(selectedGraphItems.map((g) => g.id));
      const kept = prev.filter((item) => selectedIds.has(item.id));
      const keptIds = new Set(kept.map((g) => g.id));
      const added = selectedGraphItems.filter((g) => !keptIds.has(g.id));
      return [...kept, ...added].slice(0, MAX_COMPARISON_SLOTS);
    });
  }, [selectedGraphItems]);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleDragStart = useCallback((index: number) => {
    setDragIndex(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex((prev) => prev === index ? prev : index);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback((dropIndex: number) => {
    setDragIndex((currentDragIndex) => {
      if (currentDragIndex === null || currentDragIndex === dropIndex) {
        setDragOverIndex(null);
        return null;
      }
      const fromIndex = currentDragIndex;
      setOrderedItems((prev) => {
        const updated = [...prev];
        const temp = updated[fromIndex];
        updated[fromIndex] = updated[dropIndex]!;
        updated[dropIndex] = temp!;
        return updated;
      });
      setDragOverIndex(null);
      return null;
    });
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
    setDragOverIndex(null);
  }, []);

  const handlePreviewOpen = useCallback(() => setPreviewOpen(true), []);
  const handlePreviewClose = useCallback(() => setPreviewOpen(false), []);
  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setComparisonTitle(e.target.value);
  }, []);

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

  // Memoize chart data transformations for preview graphs
  const previewChartData = useMemo(() => {
    const dataMap = new Map<string, any>();
    orderedItems.slice(0, MAX_COMPARISON_SLOTS).forEach((item) => {
      const { graph_type, graph_data } = item;
      if (graph_type === 'characteristics' && graph_data?.characteristics) {
        dataMap.set(item.id, graph_data.characteristics.map((c: any) => ({
          ...c,
          label: truncateLabel(c.characteristic, 25),
        })));
      } else if (graph_type === 'improvements' && graph_data?.improvements) {
        dataMap.set(item.id, graph_data.improvements.map((imp: any) => ({
          ...imp,
          label: truncateLabel(imp.improvement, 25),
        })));
      }
    });
    return dataMap;
  }, [orderedItems]);

  const renderPreviewGraph = (item: GraphItem) => {
    const { graph_type, graph_data } = item;

    if (graph_type === 'distribution' && graph_data?.ratings) {
      const { ratings, avg, stdev } = graph_data;
      return (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="horizontal"
                data={ratings}
                barCategoryGap={0.5}
                margin={{ top: 5, right: 15, left: -5, bottom: 0 }}
              >
                <XAxis dataKey="rating" type="category" style={{ fontSize: '0.75rem' }} />
                <YAxis type="number" domain={[0, 'auto']} style={{ fontSize: '0.75rem' }} />
                <CartesianGrid vertical={false} />
                <Bar dataKey="number" fill={GRAPH_BAR_COLORS.distribution} isAnimationActive={false}>
                  <LabelList dataKey="number" fill="#ffffff" position="inside" style={{ fontSize: '0.7rem' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
          <Box sx={{ textAlign: 'center', fontSize: '0.8rem', color: '#666', flexShrink: 0 }}>
            Avg: {avg} &nbsp; StdDev: {stdev}
          </Box>
        </Box>
      );
    }

    const chartData = previewChartData.get(item.id);

    if (graph_type === 'characteristics' && chartData) {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 5, right: 35, left: 10, bottom: 0 }}
          >
            <XAxis type="number" domain={[0, 100]} style={{ fontSize: '0.7rem' }} />
            <YAxis dataKey="label" type="category" width={110} style={{ fontSize: '0.65rem' }} />
            <CartesianGrid horizontal={false} />
            <Bar dataKey="percentage" fill={GRAPH_BAR_COLORS.characteristics} isAnimationActive={false}>
              <LabelList
                dataKey="percentage"
                position="right"
                style={{ fontSize: '0.65rem' }}
                formatter={percentFormatter}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (graph_type === 'improvements' && chartData) {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 5, right: 35, left: 10, bottom: 0 }}
          >
            <XAxis type="number" domain={[0, 100]} style={{ fontSize: '0.7rem' }} />
            <YAxis dataKey="label" type="category" width={110} style={{ fontSize: '0.65rem' }} />
            <CartesianGrid horizontal={false} />
            <Bar dataKey="percentage" fill={GRAPH_BAR_COLORS.improvements} isAnimationActive={false}>
              <LabelList
                dataKey="percentage"
                position="right"
                style={{ fontSize: '0.65rem' }}
                formatter={percentFormatter}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    }

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#aaa' }}>
        No data available
      </Box>
    );
  };

  const handleExportFromPreview = async () => {
    if (!previewGridRef.current) return;

    setExporting(true);
    await new Promise((resolve) => setTimeout(resolve, 50));

    try {
      const canvas = await html2canvas(previewGridRef.current, {
        scale: 1.5,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 0,
        onclone: (clonedDoc) => {
          const graphGrid = clonedDoc.querySelector('.graph-grid');
          if (graphGrid) graphGrid.remove();
          const comparisonDrawer = clonedDoc.querySelector('.comparison-drawer');
          if (comparisonDrawer) comparisonDrawer.remove();
        },
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.92);
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: 'letter',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 30;

      const availableWidth = pageWidth - margin * 2;
      const availableHeight = pageHeight - margin * 2;
      const ratio = Math.min(availableWidth / imgWidth, availableHeight / imgHeight);
      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;

      const xOffset = (pageWidth - scaledWidth) / 2;
      const yOffset = (pageHeight - scaledHeight) / 2;

      pdf.addImage(imgData, 'JPEG', xOffset, yOffset, scaledWidth, scaledHeight);
      const filename = comparisonTitle.trim()
        ? `${comparisonTitle.trim().replace(/[^a-zA-Z0-9 _-]/g, '').replace(/\s+/g, '-')}.pdf`
        : 'assessment-graph-comparison.pdf';
      pdf.save(filename);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setExporting(false);
    }
  };

  const slotsToShow = Math.min(orderedItems.length, MAX_COMPARISON_SLOTS);
  const emptySlots = MAX_COMPARISON_SLOTS - slotsToShow;
  const previewItems = orderedItems.slice(0, MAX_COMPARISON_SLOTS);

  return (
    <>
      <Paper className="comparison-drawer" elevation={8}>
        {/* Drawer Header */}
        <Box className="drawer-header" onClick={toggleExpanded}>
          <Box className="drawer-title">
            <h5>Comparison Preview</h5>
            <Box sx={badgeSx}>
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
            <Box className="comparison-grid">
              {orderedItems.slice(0, MAX_COMPARISON_SLOTS).map((item) => (
                <Box key={item.id} className="comparison-slot filled">
                  <IconButton
                    className="slot-remove-btn"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveGraph(item.id);
                    }}
                  >
                    <CloseIcon sx={{ fontSize: '0.85rem' }} />
                  </IconButton>
                  <Box className="slot-label">{getSlotLabel(item)}</Box>
                </Box>
              ))}
              {Array.from({ length: emptySlots }).map((_, index) => (
                <Box key={`empty-${index}`} className="comparison-slot">
                  <span>Empty Slot</span>
                </Box>
              ))}
            </Box>

            <Box className="drawer-actions">
              <Button variant="outlined" onClick={onClearSelection}>
                Clear Selection
              </Button>
              <Button
                variant="contained"
                startIcon={<OpenInFullIcon />}
                onClick={handlePreviewOpen}
                disabled={orderedItems.length === 0}
              >
                Comparison View
              </Button>
            </Box>
          </Box>
        </Collapse>
      </Paper>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={handlePreviewClose}
        maxWidth={false}
        fullWidth
        PaperProps={{ sx: dialogPaperSx }}
      >
        <DialogTitle sx={dialogTitleSx}>
          <Box>
            <Box sx={{ fontWeight: 700, fontSize: '1.2rem' }}>Comparison View</Box>
            <Box sx={{ fontSize: '0.85rem', color: '#666', mt: 0.5 }}>
              {previewItems.length} graph{previewItems.length !== 1 ? 's' : ''} selected for comparison
            </Box>
          </Box>
          <IconButton onClick={handlePreviewClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3, overflow: 'auto' }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Enter a title for this comparison (optional)"
            value={comparisonTitle}
            onChange={handleTitleChange}
            sx={{ mb: 2 }}
          />
          {previewItems.length >= 2 && (
            <Box sx={{ fontSize: '0.8rem', color: '#999', textAlign: 'center', mb: 1 }}>
              Drag cards to reorder
            </Box>
          )}
          <Box ref={previewGridRef} sx={{ backgroundColor: '#fff' }}>
            {comparisonTitle && (
              <Box className="preview-export-title">
                {comparisonTitle}
              </Box>
            )}
            <Box className="preview-grid">
            {previewItems.map((item, index) => (
              <Box
                key={item.id}
                className={`preview-card${dragIndex === index ? ' dragging' : ''}${dragOverIndex === index ? ' drag-over' : ''}`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={() => handleDrop(index)}
                onDragEnd={handleDragEnd}
              >
                <Box className="preview-card-header">
                  <Box className="preview-card-title">
                    {item.category_name} - {GRAPH_TYPE_LABELS[item.graph_type] || item.graph_type}
                  </Box>
                  <Box className="preview-card-meta">
                    {item.assessment_task_name} &bull; {item.rubric_name} &bull; {item.total_assessments} responses
                  </Box>
                </Box>
                <Box className="preview-card-graph">
                  {renderPreviewGraph(item)}
                </Box>
              </Box>
            ))}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ borderTop: '1px solid #eee', px: 3, py: 2 }}>
          <Button variant="outlined" onClick={handlePreviewClose}>
            Close
          </Button>
          <Button
            variant="contained"
            startIcon={exporting ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <DownloadIcon />}
            onClick={handleExportFromPreview}
            disabled={exporting}
          >
            {exporting ? 'Exporting...' : 'Export as PDF'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ComparisonDrawer;
