import React from 'react';
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, LabelList } from 'recharts';

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
//<i className="bi bi-ban" style={{ fontSize: `${chartHeight}px` }}></i>

  return (
    <div className="flex flex-col gap-8">
      <h6 className="text-center text-sm">
        <u>{dataType === 'characteristics' ? 'Characteristics' : 'Improvements'}</u>
      </h6>
      <div>
        <BarChart
          layout='vertical'
          data={data}
          width={650}
          height={210}
          aria-label={`barChart${dataType.charAt(0).toUpperCase() + dataType.slice(1)}Data`}
        >
          <XAxis type='number' 
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
      </div>
    </div>
  )
}