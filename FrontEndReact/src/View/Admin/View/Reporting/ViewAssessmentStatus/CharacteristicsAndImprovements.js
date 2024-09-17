import { alignProperty } from '@mui/material/styles/cssUtils';
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem"}}>
      <h5 style= {{textAlign:"center"}}>
        {dataType === 'characteristics' ? 'Characteristics' : 'Improvements'}
      </h5>
      <div>
        <BarChart
          layout='vertical'
          data={data}
          width={675}
          height={375}
          aria-label={`barChart${dataType.charAt(0).toUpperCase() + dataType.slice(1)}Data`}
        >
          <XAxis type='number' domain={[0, 'auto']}/>
          <YAxis
            width={350}
            style={{fontSize: '.9rem'}}
            type='category'
            dataKey={dataKey}
          />
          <CartesianGrid horizontal={false} />
          <Bar dataKey="number" fill="#2e8bef">
            <LabelList dataKey="percentage" fill="#ffffff" position="inside"/>
          </Bar>
        </BarChart>
      </div>
    </div>
  )
}