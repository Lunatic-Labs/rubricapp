import * as React from 'react';
import { useState } from 'react';
import AdminViewRatings from './ViewRatings/AdminViewRatings';
import AdminViewAssessmentStatus from './ViewAssessmentStatus/AdminViewAssessmentStatus';
import { Container } from '@mui/material';
import TabManager from './ReportTabs';

// TODO from Brian: When components for each tab are fully implemented, remove h1 elements on each Tab!
export default function AdminReportTabs(props) {
    var [tab, setTab] = useState('Assessment Status');
    return (
        <Container>
            <h1 className= 'm-5'> Reporting </h1> 
            <h2 className= 'm-4'>
                {props.chosenCourse["course_name"]} {props.chosenCourse["course_number"]}
            </h2>
            <TabManager setTab={setTab}/>
            { tab === 'Assessment Status' &&
                <>
                     <AdminViewAssessmentStatus
                            user={{"user_id": 2}}
                        />
                </>
            }
            { tab === 'Ratings and Feedback' &&
                <>
                    <AdminViewRatings
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
                   
   
