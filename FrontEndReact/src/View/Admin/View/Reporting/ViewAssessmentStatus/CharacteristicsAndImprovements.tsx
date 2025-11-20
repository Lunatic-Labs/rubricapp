// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import React, { useState } from 'react';
// @ts-expect-error TS(2307): Cannot find module 'recharts' or its corresponding... Remove this comment to see the full error message
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, LabelList, ResponsiveContainer, Tooltip } from 'recharts';

// CharacteristicsAndImprovements
// Small reusable component that renders either a "Characteristics" or
// "Improvements" horizontal bar chart. Used in the Admin reporting view
// to summarize observable characteristics or suggestions with percentages.

// Helper to shorten long labels for the compact chart view (keeps UI tidy)
const truncateText = (text: any, limit = 15) => {
  if (text.length <= limit) return text;
  return `${text.substring(0, limit)}...`;
};

// Custom tooltip used by the chart. When hovering a bar, this shows the full
// characteristic/improvement text in a small floating card rather than the
// truncated version shown on the Y axis.
const CustomTooltip = ({
  active,
  payload
}: any) => {
  if (active && payload && payload.length) {
    const fullText = payload[0].payload[payload[0].payload.characteristic ? 'characteristic' : 'improvement'];
    return (
      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      <div className="card position-fixed bottom-0 start-50 translate-middle-x mb-3 shadow-none border-0" style={{ maxWidth: '90vw', zIndex: 1000 }}>
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <div className="card-body p-2" style={{ backgroundColor: '#E4EDF7'}}>
          // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          <div className="row">
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <div className="col-12">
              // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              <p className="card-text mb-1">{fullText}</p>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </div>
          // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          </div>
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        </div>
      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      </div>
    );
  }
  return null;
};

export default function CharacteristicsAndImprovements({
  // props:
  // - dataType: 'characteristics' | 'improvements' determines which dataset to use
  // - characteristicsData: object containing characteristics array and metadata
  // - improvementsData: object containing improvements array and metadata
  // - showSuggestions: boolean used to decide whether to show the graph for improvements
  dataType,

  characteristicsData,
  improvementsData,
  showSuggestions
}: any) {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  

  // Select the appropriate array of items depending on the requested dataType
  const data = dataType === 'characteristics'
    ? characteristicsData.characteristics
    : improvementsData.improvements;

  // Prepare chart-friendly data: add a truncated label for compact view and
  // keep a full label used in the expanded modal chart.
  const processedData = data.map((item: any) => ({
    ...item,
    truncatedLabel: truncateText(item[dataType === 'characteristics' ? 'characteristic' : 'improvement']),
    fullLabel: item[dataType === 'characteristics' ? 'characteristic' : 'improvement']
  }));
  
  const shouldShowGraph = dataType === 'characteristics' || showSuggestions;

  

  return (
    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    <div className="container-fluid p-0 position-relative">
      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      <div className="row">
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <div className="col-12">
          // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          <div 
            className="card border-0 shadow-none" 
            style={{height: '100%', backgroundColor: '#f8f8f8'}}
          >
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <div className="card-body">
              // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              <h6 className="text-center">
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <u>{dataType === 'characteristics' ? 'Characteristics' : 'Improvements'}</u>
              // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              </h6>
              {/* Chart container (click to open expanded modal) */}
              // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              <div 
                style={{ height: '210px', position: 'relative' }}
                className="chart-container"
                onClick={openModal}
              >
                {shouldShowGraph ? (
                  <>
                    {/* Subtle overlay shown on hover to indicate click-to-expand */}
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    <div 
                      className="hover-overlay d-flex justify-content-center align-items-center position-absolute w-100 h-100" 
                      style={{ 
                        opacity: 0, 
                        transition: 'opacity 0.3s ease',
                        backgroundColor: 'rgba(46, 139, 239,0.4)',
                        color: 'rgb(255, 255, 255)',
                        textShadow: '2px 2px 5px rgb(0, 37, 79)',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        cursor: 'pointer',
                        zIndex: 10
                      }}
                    >
                      Click for expanded chart
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        layout="vertical" 
                        data={processedData} 
                        margin={{ top: 5, right: 20, bottom: 5, left: 20 }}
                      >
                        {/* Horizontal axis shows percentage values */}
                        <XAxis 
                          type="number" 
                          domain={[0, 100]} 
                          ticks={[0, 25, 50, 75, 100]} 
                          tickFormatter={(tick: any) => `${tick}`} 
                          style={{ fontSize: '12px' }} 
                        />
                        {/* Y axis displays truncated labels in the compact view */}
                        <YAxis 
                          style={{ fontSize: '12px' }} 
                          type="category" 
                          dataKey="truncatedLabel" 
                          width={100} 
                        />
                        <CartesianGrid horizontal={false} />
                        {/* Use custom tooltip to show full text when hovering a bar */}
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(46, 139, 239, 0.1)' }} />
                        <Bar dataKey="percentage" fill="#2e8bef" className="cursor-pointer">
                          {/* Show percentage label inside each bar */}
                          <LabelList 
                            dataKey="percentage" 
                            fill="#ffffff" 
                            position="inside" 
                            formatter={(value: any) => `${value}%`} 
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </>
                ) : (
                  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                  <div className="d-flex justify-content-center align-items-center h-100">
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="190" 
                      height="190" 
                      fill="grey" 
                      className="bi bi-chart" 
                      viewBox="0 0 16 16"
                    >
                      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                      <path d="M4 11H2v3h2zm5-4H7v7h2zm5-5v12h-2V2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1z"/>
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    </svg>
                  // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                  </div>
                )}
              // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              </div>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </div>
          // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          </div>
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        </div>
      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      </div>
      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      <style jsx>{`
        .chart-container:hover .hover-overlay {
          opacity: 1 !important;
        }
      `}
      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      </style>
      {/* Expanded Modal: shows a larger version of the chart with full labels */}
      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      <div className={`modal fade ${isModalOpen ? 'show' : ''}`} 
        tabIndex="-1" 
        role="dialog"
        style={{ display: isModalOpen ? 'block' : 'none', justifyContent: 'center', alignItems: 'center' }}>
      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      <div className="modal-dialog modal-lg" style={{ maxWidth: '80%' }}>
          // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          <div className="modal-content" style={{ width: '100%' }}>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <div className="modal-header position-relative">
              // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              <div className="w-100">
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <h4 className="modal-title text-center m-0 fw-normal">
                  {dataType === 'characteristics' ? 'Characteristics' : 'Improvements'}
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                </h4>
              // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              </div>
              // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              <button type="button" 
                      className="btn-close position-absolute"
                      style={{ right: '1rem', top: '50%', transform: 'translateY(-50%)' }}
                      onClick={closeModal} 
                      aria-label="Close">
              // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              </button>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </div>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <div className="modal-body">
              <ResponsiveContainer width="100%" height={500}>
                <BarChart
                  layout="vertical"
                  data={processedData}
                  margin={{ top: 5, right: 20, bottom: 5, left: 20 }}
                >
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                    tickFormatter={(tick: any) => `${tick}`}
                    style={{ fontSize: '15px' }}
                    scale="linear" 
                  />
                  {/* In the expanded view we show the full, un-truncated labels */}
                  <YAxis
                    style={{ fontSize: '15px' }}
                    type="category"
                    dataKey="fullLabel"
                    width={300}
                  />
                  <CartesianGrid horizontal={false} />
                  <Bar 
                    dataKey="percentage" 
                    fill="#2e8bef"
                  >
                    <LabelList 
                      dataKey="percentage" 
                      fill="#ffffff" 
                      position="inside"
                      formatter={(value: any) => `${value}%`}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            </div>
          // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
          </div>
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        </div>
      // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
      </div>
      {isModalOpen && (
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <div className="modal-backdrop fade show" 
             onClick={closeModal}>
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        </div>
      )}
    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    </div>
  );
}