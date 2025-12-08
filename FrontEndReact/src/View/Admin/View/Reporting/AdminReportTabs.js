import * as React from 'react';
import { useState } from 'react';
import AdminViewRatings from './ViewRatings/AdminViewRatings';
import AdminViewAssessmentStatus from './ViewAssessmentStatus/AdminViewAssessmentStatus';
import ReportingMainHeader from '../../../Components/ReportingHeader';

//Manages tab state and routes between different report views. Maintain the current selected assessment across tab switches. 
// Acts as the controller/router for the reporting dashboard
//Maintains active tabe state and selected ID state 

export default function AdminReportTabs(props) {
    //Tracks which tab is currently active
    //Default to Assessment Status tab on initial render
    var [tab, setTab] = useState('Assessment Status');
    
    //Track which assessment task is currently selected
    //Initialize with first assessment ID if it exists
    var defaultAssessmentTaskId = "";
    //
    if(props.assessmentTasks.length !== 0) {
        defaultAssessmentTaskId = props.assessmentTasks[0]["assessment_task_id"];
    }
    //Store selected assessment ID in state
    //This state is shared between both tab views
    var [chosenAssessmentId, setChosenAssessmentId] = useState(defaultAssessmentTaskId);
    //Updates the selected assessment when user changes dropdown
    const handleChosenAssessmentIdChange = (event) => {
        setChosenAssessmentId(event.target.value);
    };

    return (
        <>
        {/*Course info and tab navigation*/}
            <ReportingMainHeader
                navbar={props.navbar}   //Provides course context
                setTab={setTab}         //Function to change active tab
            />
            {/*CAssessment status tab Shows submissions, grading status, and overall progress */}
            { tab === 'Assessment Status' &&
                <AdminViewAssessmentStatus
                    navbar={props.navbar}
                    assessmentTasks={props.assessmentTasks}
                    chosenAssessmentId={chosenAssessmentId}
                    setChosenAssessmentId={handleChosenAssessmentIdChange}
                />
            }
            {/*Shows rating table and CSV export functionality */}
            { tab === 'Ratings and Feedback' &&
                <AdminViewRatings
                    navbar={props.navbar}
                    assessmentTasks={props.assessmentTasks}
                    chosenAssessmentId={chosenAssessmentId}
                    setChosenAssessmentId={handleChosenAssessmentIdChange}
                />
             }
            {/*Placholder for student improvment tracking feature - work in progress */}
            { tab === 'Improvement' &&
                <h1 className='mt-3'>Improvement</h1>
            }
            {/*Placeholder for rater calibration and consistency feature - work in progress*/}
            { tab === 'Calibrations' &&
                <h1 className='mt-3'>Calibrations</h1>
            }
        </>
    );
}