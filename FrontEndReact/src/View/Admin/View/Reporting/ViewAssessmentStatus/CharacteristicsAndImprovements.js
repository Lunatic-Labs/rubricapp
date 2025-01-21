import React from 'react';
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
  completedAssessments
}) {
  console.log('Data Type:', dataType);
  console.log('Completed Assessments:', completedAssessments);
  console.log('Characteristics Data:', characteristicsData);
  console.log('Improvements Data:', improvementsData);
  const data = dataType === 'characteristics'
    ? characteristicsData.characteristics
    : improvementsData.improvements;

  const processedData = data.map(item => ({
    ...item,
    truncatedLabel: truncateText(item[dataType === 'characteristics' ? 'characteristic' : 'improvement']),
    number: ((item.number / completedAssessments)*100).toFixed(2)
  }));

  const shouldShowGraph = dataType === 'characteristics' || showSuggestions;

  return (
    <div className="container-fluid p-0"> 
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-none" style={{height: '100%', backgroundColor: '#f8f8f8' }}>
            <div className="card-body">
              <h6 className="text-center mb-4">
                <u>{dataType === 'characteristics' ? 'Characteristics' : 'Improvements'}</u>
              </h6>
              
              <div style={{ height: '210px' }}>
                {shouldShowGraph ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={processedData}
                      margin={{ 
                        top: 5, 
                        right: 20, 
                        bottom: 5, 
                        left: 20 
                      }}
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
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'rgba(46, 139, 239, 0.1)' }}
                      />
                      <Bar 
                        dataKey="number" 
                        fill="#2e8bef"
                        className="cursor-pointer"
                      >
                        <LabelList 
                          dataKey="number" 
                          fill="#ffffff" 
                          position="inside"
                          formatter={value => `${value}%`}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="d-flex justify-content-center align-items-center h-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="190" height="190" fill="grey" className="bi bi-chart" viewBox="0 0 16 16">
                      <path d="M4 11H2v3h2zm5-4H7v7h2zm5-5v12h-2V2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1z"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}