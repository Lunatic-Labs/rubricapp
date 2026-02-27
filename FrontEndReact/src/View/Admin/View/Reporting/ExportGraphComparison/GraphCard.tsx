import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Box, Checkbox, Paper } from '@mui/material';
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
import {
  GRAPH_TYPE_LABELS,
  GRAPH_PLACEHOLDER_COLORS,
  GRAPH_BAR_COLORS,
  truncateLabel,
  formatDate,
} from './graphConstants';

// Static style objects - defined once, never recreated
const checkboxSx = {
  color: '#2E8BEF',
  '&.Mui-checked': { color: '#2E8BEF' },
} as const;

const percentFormatter = (v: any) => `${v}%`;

interface GraphCardProps {
  graphItem: GraphItem;
  isSelected: boolean;
  onSelect: (graphId: string) => void;
}

const GraphCard: React.FC<GraphCardProps> = ({ graphItem, isSelected, onSelect }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0] && entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName !== 'INPUT') {
      onSelect(graphItem.id);
    }
  }, [onSelect, graphItem.id]);

  const handleCheckboxClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(graphItem.id);
  }, [onSelect, graphItem.id]);

  const title = useMemo(() => {
    if (graphItem.graph_type === 'distribution') {
      return `${graphItem.category_name} - Distribution`;
    }
    return `${graphItem.category_name} - ${GRAPH_TYPE_LABELS[graphItem.graph_type] || graphItem.graph_type}`;
  }, [graphItem.category_name, graphItem.graph_type]);

  const metaInfo = useMemo(() => {
    const parts = [graphItem.assessment_task_name];
    if (graphItem.team_name) parts.push(graphItem.team_name);
    if (graphItem.student_name) parts.push(graphItem.student_name);
    parts.push(formatDate(graphItem.due_date));
    parts.push(`${graphItem.total_assessments} responses`);
    return parts.join(' \u2022 ');
  }, [graphItem.assessment_task_name, graphItem.team_name, graphItem.student_name, graphItem.due_date, graphItem.total_assessments]);

  // Memoize data transformations for horizontal bar charts
  const chartData = useMemo(() => {
    const { graph_type, graph_data } = graphItem;
    if (graph_type === 'characteristics' && graph_data?.characteristics) {
      return graph_data.characteristics.map((item: any) => ({
        ...item,
        label: truncateLabel(item.characteristic),
      }));
    }
    if (graph_type === 'improvements' && graph_data?.improvements) {
      return graph_data.improvements.map((item: any) => ({
        ...item,
        label: truncateLabel(item.improvement),
      }));
    }
    return null;
  }, [graphItem]);

  const renderGraph = () => {
    if (!isVisible) {
      return (
        <Box sx={{
          width: '100%',
          height: '100%',
          backgroundColor: GRAPH_PLACEHOLDER_COLORS[graphItem.graph_type] || '#f0f4f8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#aaa',
          fontSize: '0.8rem',
        }}>
          Loading...
        </Box>
      );
    }

    const { graph_type, graph_data } = graphItem;

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
                margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
              >
                <XAxis dataKey="rating" type="category" style={{ fontSize: '0.65rem' }} />
                <YAxis type="number" domain={[0, 'auto']} style={{ fontSize: '0.65rem' }} />
                <CartesianGrid vertical={false} />
                <Bar dataKey="number" fill={GRAPH_BAR_COLORS.distribution} isAnimationActive={false}>
                  <LabelList dataKey="number" fill="#ffffff" position="inside" style={{ fontSize: '0.6rem' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
          <Box sx={{ textAlign: 'center', fontSize: '0.7rem', color: '#666', flexShrink: 0 }}>
            Avg: {avg} &nbsp; StdDev: {stdev}
          </Box>
        </Box>
      );
    }

    if (graph_type === 'characteristics' && chartData) {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 5, right: 30, left: 5, bottom: 0 }}
          >
            <XAxis type="number" domain={[0, 100]} style={{ fontSize: '0.6rem' }} />
            <YAxis dataKey="label" type="category" width={90} style={{ fontSize: '0.55rem' }} />
            <CartesianGrid horizontal={false} />
            <Bar dataKey="percentage" fill={GRAPH_BAR_COLORS.characteristics} isAnimationActive={false}>
              <LabelList
                dataKey="percentage"
                position="right"
                style={{ fontSize: '0.55rem' }}
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
            margin={{ top: 5, right: 30, left: 5, bottom: 0 }}
          >
            <XAxis type="number" domain={[0, 100]} style={{ fontSize: '0.6rem' }} />
            <YAxis dataKey="label" type="category" width={90} style={{ fontSize: '0.55rem' }} />
            <CartesianGrid horizontal={false} />
            <Bar dataKey="percentage" fill={GRAPH_BAR_COLORS.improvements} isAnimationActive={false}>
              <LabelList
                dataKey="percentage"
                position="right"
                style={{ fontSize: '0.55rem' }}
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

  return (
    <Paper
      ref={cardRef}
      data-graph-id={graphItem.id}
      className={`graph-card ${isSelected ? 'selected' : ''}`}
      onClick={handleCardClick}
      elevation={isSelected ? 3 : 1}
    >
      <Box className="graph-preview">
        <Box className="graph-card-checkbox">
          <Checkbox
            checked={isSelected}
            onClick={handleCheckboxClick}
            sx={checkboxSx}
          />
        </Box>
        {renderGraph()}
      </Box>

      <Box className="graph-card-info">
        <p className="graph-card-title">{title}</p>
        <p className="graph-card-meta">{metaInfo}</p>
      </Box>
    </Paper>
  );
};

export default React.memo(GraphCard, (prevProps, nextProps) => {
  return (
    prevProps.graphItem === nextProps.graphItem &&
    prevProps.isSelected === nextProps.isSelected
  );
});
