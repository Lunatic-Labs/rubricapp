import * as React from 'react';
import { useState } from 'react';
import AdminViewRatings from './ViewRatings/AdminViewRatings';
import AdminViewAssessmentStatus from './ViewAssessmentStatus/AdminViewAssessmentStatus';
import ReportingMainHeader from '../../../Components/ReportingHeader';



// TODO from Brian: When components for each tab are fully implemented, remove h1 elements on each Tab!
export default function AdminReportTabs(props) {
    var [tab, setTab] = useState('Assessment Status');
    
    var [chosen_assessment_id, set_chosen_assessment_id] = useState(1);
    const handle_chosen_assessment_id_change = (event) => {
        set_chosen_assessment_id(event.target.value);
    };

    // console.log("AdminReportTabs", props.navbar, props.assessment_tasks, props.assessment_is_team);
    // console.log("AdminReportTabs CAID", chosen_assessment_id);

    return (
        <>
            <ReportingMainHeader
                navbar={props.navbar}
                setTab={setTab}
            />

            { tab === 'Assessment Status' &&
                <AdminViewAssessmentStatus
                    navbar={props.navbar}
                    assessment_tasks={props.assessment_tasks}
                    chosen_assessment_id={chosen_assessment_id}
                    set_chosen_assessment_id={handle_chosen_assessment_id_change}
                />
            }

            { tab === 'Ratings and Feedback' &&
                <AdminViewRatings
                    chosenCourse={props.navbar.state.chosenCourse}
                    assessment_tasks={props.assessment_tasks}
                    chosen_assessment_id={chosen_assessment_id}
                    set_chosen_assessment_id={handle_chosen_assessment_id_change}
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