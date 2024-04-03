import * as React from 'react';
import { useState } from 'react';
import AdminViewRatings from './ViewRatings/AdminViewRatings';
import AdminViewAssessmentStatus from './ViewAssessmentStatus/AdminViewAssessmentStatus';
import ReportingMainHeader from '../../../Components/ReportingHeader';



// TODO from Brian: When components for each tab are fully implemented, remove h1 elements on each Tab!
export default function AdminReportTabs(props) {
    var [tab, setTab] = useState('Assessment Status');

    var defaultAssessmentTaskId = props.assessmentTasks[0]["assessment_task_id"];

    var [chosenAssessmentId, setChosenAssessmentId] = useState(defaultAssessmentTaskId);

    const handleChosenAssessmentIdChange = (event) => {
        setChosenAssessmentId(event.target.value);
    };

    return (
        <>
            <ReportingMainHeader
                navbar={props.navbar}
                setTab={setTab}
            />

            { tab === 'Assessment Status' &&
                <AdminViewAssessmentStatus
                    navbar={props.navbar}
                    assessmentTasks={props.assessmentTasks}
                    chosenAssessmentId={chosenAssessmentId}
                    setChosenAssessmentId={handleChosenAssessmentIdChange}
                />
            }

            { tab === 'Ratings and Feedback' &&
                <AdminViewRatings
                    // chosenCourse={props.navbar.state.chosenCourse}
                    navbar={props.navbar}
                    assessmentTasks={props.assessmentTasks}
                    chosenAssessmentId={chosenAssessmentId}
                    setChosenAssessmentId={handleChosenAssessmentIdChange}
                />
             }

            { tab === 'Improvement' &&
                <h1 className='mt-3'>Improvement</h1>
            }

            { tab === 'Calibrations' &&
                <h1 className='mt-3'>Calibrations</h1>
            }
        </>
    );
}