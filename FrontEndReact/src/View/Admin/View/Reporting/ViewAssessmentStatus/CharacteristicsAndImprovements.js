import React, { useState } from 'react';
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, LabelList } from 'recharts';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';


export default function CharacteristicsAndImprovements(props) {
  const [tabId, setTabId] = useState(0);
  
  const handleChange = (event, newValue) => {
    setTabId(newValue);
  };

  // If suggestions for improvement are turned off for the selected AT, set the tabId to
  // correspond to the observable characteristics tab
  if (!props.showSuggestions && tabId === 1) {
    setTabId(0);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem"}}>
      <Tabs value={tabId} onChange={handleChange} centered>
        <Tab label="Characteristics" aria-label='characteristicsAndImprovementsCharacteristicsTab'/>
        { props.showSuggestions &&
          <Tab label="Improvement" aria-label='characteristicsAndImprovementsImprovementTab'/>
        }
      </Tabs>

      <div>
        <BarChart
          layout='vertical'
          data={tabId === 0 ? props.characteristicsData["characteristics"] : props.improvementsData["improvements"]}
          width={750}
          height={250}
          aria-label={tabId === 0 ? "barChartCharacteristicsData" : "barChartImprovementsData"}
        >
          <XAxis type='number' domain={[0, 'auto']}/>

          <YAxis
            width={350}
            style={{fontSize: '0.8rem'}}
            type='category'
            dataKey={tabId === 0 ? "characteristic" : "improvement"}
          />

          <CartesianGrid horizontal= {false} />

          <Bar dataKey= "number" fill = "#2e8bef">
            <LabelList dataKey="percentage" fill="#ffffff" position="inside"/>
          </Bar>
        </BarChart>
      </div>
    </div>
  )
}