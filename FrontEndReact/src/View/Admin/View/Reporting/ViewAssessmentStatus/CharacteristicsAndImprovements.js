import React, { useState } from 'react';
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, LabelList, ResponsiveContainer, Tooltip } from 'recharts';

const truncateText = (text, limit = 15) => {
  if (text.length <= limit) return text;
  return `${text.substring(0, limit)}...`;
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const fullText = payload[0].payload[payload[0].payload.characteristic ? 'characteristic' : 'improvement'];
    return (
      <div className="card position-fixed bottom-0 start-50 translate-middle-x mb-3 shadow-none border-0" style={{ maxWidth: '90vw', zIndex: 1000 }}>
        <div className="card-body p-2" style={{ backgroundColor: '#E4EDF7'}}>
          <div className="row">
            <div className="col-12">
              <p className="card-text mb-1">{fullText}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function CharacteristicsAndImprovements({
  dataType,
  characteristicsData,
  improvementsData,
  showSuggestions,
}) {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const data = dataType === 'characteristics'
    ? characteristicsData.characteristics
    : improvementsData.improvements;

  const processedData = data.map(item => ({
    ...item,
    truncatedLabel: truncateText(item[dataType === 'characteristics' ? 'characteristic' : 'improvement']),
    fullLabel: item[dataType === 'characteristics' ? 'characteristic' : 'improvement']
  }));
  
  const shouldShowGraph = dataType === 'characteristics' || showSuggestions;

  return (
    <div className="container-fluid p-0 position-relative">
      <div className="row">
        <div className="col-12">
          <div 
            className="card border-0 shadow-none" 
            style={{height: '100%', backgroundColor: '#f8f8f8'}}
          >
            <div className="card-body">
              <h6 className="text-center">
                <u>{dataType === 'characteristics' ? 'Characteristics' : 'Improvements'}</u>
              </h6>
              <div 
                style={{ height: '210px', position: 'relative' }}
                className="chart-container"
                onClick={openModal}
              >
                {shouldShowGraph ? (
                  <>
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
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        layout="vertical" 
                        data={processedData} 
                        margin={{ top: 5, right: 20, bottom: 5, left: 20 }}
                      >
                        <XAxis 
                          type="number" 
                          domain={[0, 100]} 
                          ticks={[0, 25, 50, 75, 100]} 
                          tickFormatter={(tick) => `${tick}`} 
                          style={{ fontSize: '12px' }} 
                        />
                        <YAxis 
                          style={{ fontSize: '12px' }} 
                          type="category" 
                          dataKey="truncatedLabel" 
                          width={100} 
                        />
                        <CartesianGrid horizontal={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(46, 139, 239, 0.1)' }} />
                        <Bar dataKey="percentage" fill="#2e8bef" className="cursor-pointer">
                          <LabelList 
                            dataKey="percentage" 
                            fill="#ffffff" 
                            position="inside" 
                            formatter={value => `${value}%`} 
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </>
                ) : (
                  <div className="d-flex justify-content-center align-items-center h-100">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="190" 
                      height="190" 
                      fill="grey" 
                      className="bi bi-chart" 
                      viewBox="0 0 16 16"
                    >
                      <path d="M4 11H2v3h2zm5-4H7v7h2zm5-5v12h-2V2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1z"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .chart-container:hover .hover-overlay {
          opacity: 1 !important;
        }
      `}
      </style>
      {/* Expanded Modal */}
      <div className={`modal fade ${isModalOpen ? 'show' : ''}`} 
        tabIndex="-1" 
        role="dialog"
        style={{ display: isModalOpen ? 'block' : 'none', justifyContent: 'center', alignItems: 'center' }}>
      <div className="modal-dialog modal-lg" style={{ maxWidth: '80%' }}>
        <ResponsiveContainer width="100%" height= "100%">
          <div className="modal-content">
            <div className="modal-header position-relative">
              <div className="w-100">
                <h4 className="modal-title text-center m-0 fw-normal">
                  {dataType === 'characteristics' ? 'Characteristics' : 'Improvements'}
                </h4>
              </div>
              <button type="button" 
                      className="btn-close position-absolute"
                      style={{ right: '1rem', top: '50%', transform: 'translateY(-50%)' }}
                      onClick={closeModal} 
                      aria-label="Close">
              </button>
            </div>
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
                    tickFormatter={(tick) => `${tick}`}
                    style={{ fontSize: '15px' }}
                    scale="linear" 
                  />
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
                      formatter={value => `${value}%`}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          </ResponsiveContainer>
        </div>
      </div>
      {isModalOpen && (
        <div className="modal-backdrop fade show" 
             onClick={closeModal}>
        </div>
      )}
    </div>
  );
}