import React from 'react';
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, LabelList } from 'recharts';
import "bootstrap/dist/css/bootstrap.css";

export default function CharacteristicsAndImprovements({
  dataType,
  characteristicsData,
  improvementsData,
  showSuggestions
}) {
  const data = dataType === 'characteristics'
    ? characteristicsData.characteristics
    : improvementsData.improvements;
  const dataKey = dataType === 'characteristics' ? 'characteristic' : 'improvement';
  const chartHeight = 210;
  const chartWidth = 650;

  const shouldShowGraph = dataType === 'characteristics' || showSuggestions;

  return (
    <div className="flex flex-col gap-8">
      <h6 className="text-center text-sm">
        <u>{dataType === 'characteristics' ? 'Characteristics' : 'Improvements'}</u>
      </h6>
      <div>
        {shouldShowGraph ? (
          <BarChart
            layout='vertical'
            data={data}
            width={chartWidth}
            height={chartHeight}
            aria-label={`barChart${dataType.charAt(0).toUpperCase() + dataType.slice(1)}Data`}
          >
            <XAxis
              type='number'
              domain={[0, 'auto']}
              style={{ fontSize: '0.75rem' }}
            />
            <YAxis
              width={350}
              style={{ fontSize: '0.675rem' }}
              type='category'
              dataKey={dataKey}
            />
            <CartesianGrid horizontal={false} />
            <Bar dataKey="number" fill="#2e8bef">
              <LabelList dataKey="percentage" fill="#ffffff" position="inside" />
            </Bar>
          </BarChart>
        ) : (
          <div className="flex justify-center items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="190" height="190" fill="light grey" class="bi bi-bar-chart" viewBox="0 0 16 16">
              <path d="M4 11H2v3h2zm5-4H7v7h2zm5-5v12h-2V2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1z"/>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}