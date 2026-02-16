import React, { useRef, useState, useEffect } from 'react';
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

interface GraphCardProps {
  graphItem: GraphItem;
  isSelected: boolean;
  onSelect: () => void;
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
          observer.disconnect(); // Once visible, stay rendered
        }
      },
      { rootMargin: '200px' } // Pre-render cards 200px before they scroll into view
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getGraphTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      distribution: 'Rating Distribution',
      characteristics: 'Observable Characteristics',
      improvements: 'Suggestions for Improvement',
    };
    return labels[type] || type;
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName !== 'INPUT') {
      onSelect();
    }
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  const getTitle = () => {
    if (graphItem.graph_type === 'distribution') {
      return `${graphItem.category_name} - Distribution`;
    }
    return `${graphItem.category_name} - ${getGraphTypeLabel(graphItem.graph_type)}`;
  };

  const getMetaInfo = () => {
    const parts = [graphItem.assessment_task_name];

    if (graphItem.team_name) {
      parts.push(graphItem.team_name);
    }
    if (graphItem.student_name) {
      parts.push(graphItem.student_name);
    }

    parts.push(formatDate(graphItem.due_date));
    parts.push(`${graphItem.total_assessments} responses`);

    return parts.join(' \u2022 ');
  };

  // Truncate long text for horizontal bar labels
  const truncateLabel = (text: string, maxLen: number = 18) => {
    return text.length > maxLen ? text.substring(0, maxLen) + '...' : text;
  };

  const getPlaceholderColor = () => {
    const colors: { [key: string]: string } = {
      distribution: '#e3f0fc',
      characteristics: '#e8f5e9',
      improvements: '#ffebee',
    };
    return colors[graphItem.graph_type] || '#f0f4f8';
  };

  const renderGraph = () => {
    if (!isVisible) {
      return (
        <Box sx={{
          width: '100%',
          height: '100%',
          backgroundColor: getPlaceholderColor(),
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
                <Bar dataKey="number" fill="#2e8bef" isAnimationActive={false}>
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

    if (graph_type === 'characteristics' && graph_data?.characteristics) {
      const data = graph_data.characteristics.map((item: any) => ({
        ...item,
        label: truncateLabel(item.characteristic),
      }));
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 5, right: 30, left: 5, bottom: 0 }}
          >
            <XAxis type="number" domain={[0, 100]} style={{ fontSize: '0.6rem' }} />
            <YAxis dataKey="label" type="category" width={90} style={{ fontSize: '0.55rem' }} />
            <CartesianGrid horizontal={false} />
            <Bar dataKey="percentage" fill="#4CAF50" isAnimationActive={false}>
              <LabelList
                dataKey="percentage"
                position="right"
                style={{ fontSize: '0.55rem' }}
                formatter={(v: any) => `${v}%`}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (graph_type === 'improvements' && graph_data?.improvements) {
      const data = graph_data.improvements.map((item: any) => ({
        ...item,
        label: truncateLabel(item.improvement),
      }));
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 5, right: 30, left: 5, bottom: 0 }}
          >
            <XAxis type="number" domain={[0, 100]} style={{ fontSize: '0.6rem' }} />
            <YAxis dataKey="label" type="category" width={90} style={{ fontSize: '0.55rem' }} />
            <CartesianGrid horizontal={false} />
            <Bar dataKey="percentage" fill="#E53935" isAnimationActive={false}>
              <LabelList
                dataKey="percentage"
                position="right"
                style={{ fontSize: '0.55rem' }}
                formatter={(v: any) => `${v}%`}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    }

    // Fallback if no data
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
      {/* Graph Preview Area */}
      <Box className="graph-preview">
        <Box className="graph-card-checkbox">
          <Checkbox
            checked={isSelected}
            onClick={handleCheckboxClick}
            sx={{
              color: '#2E8BEF',
              '&.Mui-checked': {
                color: '#2E8BEF',
              },
            }}
          />
        </Box>
        {renderGraph()}
      </Box>

      {/* Card Info */}
      <Box className="graph-card-info">
        <p className="graph-card-title">{getTitle()}</p>
        <p className="graph-card-meta">{getMetaInfo()}</p>
      </Box>
    </Paper>
  );
};

export default React.memo(GraphCard, (prevProps, nextProps) => {
  // Only re-render if the graph data or selection state changed
  return (
    prevProps.graphItem.id === nextProps.graphItem.id &&
    prevProps.isSelected === nextProps.isSelected
  );
});
