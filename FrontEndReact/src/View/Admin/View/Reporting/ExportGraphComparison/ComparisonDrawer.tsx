import React, { useRef, useState } from 'react';
import { Box, Button, CircularProgress, Collapse, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Paper } from '@mui/material';
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
  const [previewOpen, setPreviewOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const previewGridRef = useRef<HTMLDivElement>(null);

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

  const truncateLabel = (text: string, maxLen: number = 25) => {
    return text.length > maxLen ? text.substring(0, maxLen) + '...' : text;
  };

  const getGraphTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      distribution: 'Rating Distribution',
      characteristics: 'Observable Characteristics',
      improvements: 'Suggestions for Improvement',
    };
    return labels[type] || type;
  };

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
                <Bar dataKey="number" fill="#2e8bef" isAnimationActive={false}>
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

    if (graph_type === 'characteristics' && graph_data?.characteristics) {
      const data = graph_data.characteristics.map((c: any) => ({
        ...c,
        label: truncateLabel(c.characteristic),
      }));
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 5, right: 35, left: 10, bottom: 0 }}
          >
            <XAxis type="number" domain={[0, 100]} style={{ fontSize: '0.7rem' }} />
            <YAxis dataKey="label" type="category" width={110} style={{ fontSize: '0.65rem' }} />
            <CartesianGrid horizontal={false} />
            <Bar dataKey="percentage" fill="#4CAF50" isAnimationActive={false}>
              <LabelList
                dataKey="percentage"
                position="right"
                style={{ fontSize: '0.65rem' }}
                formatter={(v: any) => `${v}%`}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (graph_type === 'improvements' && graph_data?.improvements) {
      const data = graph_data.improvements.map((imp: any) => ({
        ...imp,
        label: truncateLabel(imp.improvement),
      }));
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 5, right: 35, left: 10, bottom: 0 }}
          >
            <XAxis type="number" domain={[0, 100]} style={{ fontSize: '0.7rem' }} />
            <YAxis dataKey="label" type="category" width={110} style={{ fontSize: '0.65rem' }} />
            <CartesianGrid horizontal={false} />
            <Bar dataKey="percentage" fill="#FF9800" isAnimationActive={false}>
              <LabelList
                dataKey="percentage"
                position="right"
                style={{ fontSize: '0.65rem' }}
                formatter={(v: any) => `${v}%`}
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

  const handlePreviewOpen = () => {
    setPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setPreviewOpen(false);
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
          // Remove heavy background elements (all the graph cards behind the dialog)
          // so html2canvas only processes the 4 preview graphs
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
      pdf.save('assessment-graph-comparison.pdf');
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setExporting(false);
    }
  };

  const slotsToShow = Math.min(selectedGraphItems.length, MAX_COMPARISON_SLOTS);
  const emptySlots = MAX_COMPARISON_SLOTS - slotsToShow;
  const previewItems = selectedGraphItems.slice(0, MAX_COMPARISON_SLOTS);

  return (
    <>
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
                onClick={handlePreviewOpen}
                disabled={selectedGraphItems.length === 0}
              >
                Export Preview
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
        PaperProps={{
          sx: {
            width: '90vw',
            maxWidth: '1200px',
            height: '85vh',
            maxHeight: '900px',
            borderRadius: '12px',
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', pb: 1.5 }}>
          <Box>
            <Box sx={{ fontWeight: 700, fontSize: '1.2rem' }}>Export Preview</Box>
            <Box sx={{ fontSize: '0.85rem', color: '#666', mt: 0.5 }}>
              {previewItems.length} graph{previewItems.length !== 1 ? 's' : ''} selected for comparison
            </Box>
          </Box>
          <IconButton onClick={handlePreviewClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3, overflow: 'auto' }}>
          <Box ref={previewGridRef} className="preview-grid">
            {previewItems.map((item) => (
              <Box key={item.id} className="preview-card">
                <Box className="preview-card-header">
                  <Box className="preview-card-title">
                    {item.category_name} - {getGraphTypeLabel(item.graph_type)}
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
