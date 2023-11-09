import * as React from 'react';
import { useState } from 'react';
import AdminViewReport from './AdminViewReport';
import { Container } from '@mui/material';
import TabManager from './ReportTabs';

// TODO from Brian: When components for each tab are fully implemented, remove h1 elements on each Tab!
export default function ReportHome(props) {
    var [tab, setTab] = useState('Assessment Status');
    return (
        <Container>
            <h2 className='m-1'>
                {props.chosenCourse["course_name"]} {props.chosenCourse["course_number"]}
            </h2>
            <TabManager setTab={setTab}/>
            { tab === 'Assessment Status' &&
                <>
                    <h1 className='mt-3'>Assessment Status</h1>
                </>
            }
            { tab === 'Ratings and Feedback' &&
                <>
                    <AdminViewReport
                        chosenCourse={props.chosenCourse}
                    />
                </>
             }
            { tab === 'Improvement' &&
                <>
                    <h1 className='mt-3'>Improvement</h1>
                </>
            }
            { tab === 'Calibrations' &&
                <>
                    <h1 className='mt-3'>Calibrations</h1>
                </>
            }
        </Container>
    );
}  
                   
   
