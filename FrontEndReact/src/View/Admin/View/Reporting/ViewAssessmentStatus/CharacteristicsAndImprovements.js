import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { Container } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, ResponsiveContainer, LabelList } from 'recharts';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';


export default function CharacteristicsAndImprovements(props) {
  const [tabId, setTabId] = React.useState(0);
  
  const handleChange = (event, newValue) => {
    setTabId(newValue);
  };

  return (
    <>
      <Tabs value={tabId} onChange={handleChange} centered>
        <Tab label="Characteristics"/>
        { props.showSuggestions &&
          <Tab label="Improvement"/>
        }          
      </Tabs>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout='vertical'
          data={tabId == 0 ? props.characteristicsData["characteristics"] : props.improvementsData["improvements"]}
        >
          <XAxis type='number' domain={[0, 'auto']}/>

          <YAxis 
            width={250} 
            style={{ fontSize: '12px', width: 'fit-content'}} 
            type='category' 
            dataKey={tabId == 0 ? "characteristic" : "improvement"}
          />

          <CartesianGrid horizontal= {false} />

          <Bar dataKey= "number" fill = "#2e8bef">
            <LabelList dataKey="percentage" fill="#ffffff" position="inside"/>
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </>
  )
}