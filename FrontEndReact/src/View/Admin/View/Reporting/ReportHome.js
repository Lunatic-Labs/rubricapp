import * as React from 'react';
import { useState } from 'react';
import AdminViewReport from './AdminViewReport';
import { Container } from '@mui/material';
import TabManager from './ReportTabs';

export default function ReportHome(props) {
    var [tab, setTab] = useState('');
    return (
        <>
         <h1>
            {props.chosenCourse["course_name"]} {props.chosenCourse["course_number"]}
        </h1>
        <Container>
            <TabManager setTab={setTab}/>

            { tab === 'Ratings and Feedback' &&
                    <AdminViewReport
                    chosenCourse={props.chosenCourse}
                 />
             }
              {/* { tab === 'Improvement' &&
                    <AdminViewReport
                    chosenCourse={props.chosenCourse}
                 />
             } */}
        </Container>
         </>
    );
}  
                   
   
