import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, ResponsiveContainer, LabelList } from 'recharts';
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

  console.log(props.characteristicsData["characteristics"]);

  return (
    <>
      <div style={{height: "20%"}}>
        <Tabs orientation='vertical' value={tabId} onChange={handleChange} centered>
          {console.log("Flap")}
          <Tab label="Characteristics"/>
          { props.showSuggestions &&
            <Tab label="Improvement"/>
          }
        </Tabs>
      </div>

      <div style={{height: "80%"}}>
      <Stack spacing={2}>
      {(tabId == 0 ? props.characteristicsData["characteristics"] : props.improvementsData["improvements"]).map((i) => (
        <h6>{tabId == 0 ? i['characteristic'] : i["improvement"]}</h6>
      ))}
      </Stack>
      </div>
      

      {/* <ResponsiveContainer width="100%">
        <BarChart
          layout='vertical'
          data={tabId === 0 ? props.characteristicsData["characteristics"] : props.improvementsData["improvements"]}
        >
          <XAxis type='number' domain={[0, 'auto']}/>

          <YAxis 
            width={250} 
            style={{ fontSize: '12px', width: 'fit-content'}} 
            type='category' 
            dataKey={tabId === 0 ? "characteristic" : "improvement"}
          />

          <CartesianGrid horizontal= {false} />

          <Bar dataKey= "number" fill = "#2e8bef">
            <LabelList dataKey="percentage" fill="#ffffff" position="inside"/>
          </Bar>
        </BarChart>
      </ResponsiveContainer> */}
    </>
  )
}