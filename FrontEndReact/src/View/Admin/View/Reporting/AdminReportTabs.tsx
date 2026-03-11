import * as React from 'react';
import { useState } from 'react';
import AdminViewRatings from './ViewRatings/AdminViewRatings';
import AdminViewAssessmentStatus from './ViewAssessmentStatus/AdminViewAssessmentStatus';
import AdminExportGraphComparison from './ExportGraphComparison/AdminExportGraphComparison';
import ReportingMainHeader from '../../../Components/ReportingHeader';
import { AssessmentTask } from '../../../../types/AssessmentTask';

interface AdminReportTabsProps {
    navbar: any;
    assessmentTasks: AssessmentTask[];
}

export default function AdminReportTabs(props: AdminReportTabsProps) {
    var [tab, setTab] = useState('Assessment Status');
    
    var defaultAssessmentTaskId: string | number = "";
    if(props.assessmentTasks.length !== 0) {
        defaultAssessmentTaskId = props.assessmentTasks[0]!["assessment_task_id"];
    }
    var [chosenAssessmentId, setChosenAssessmentId] = useState<string | number>(defaultAssessmentTaskId);


    const handleChosenAssessmentIdChange = (id: string | number) => {
    setChosenAssessmentId(id);
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
                    navbar={props.navbar}
                    assessmentTasks={props.assessmentTasks}
                    chosenAssessmentId={chosenAssessmentId}
                    setChosenAssessmentId={handleChosenAssessmentIdChange}
                />
             }

            { tab === 'Export Graph Comparison' &&
                <AdminExportGraphComparison
                    navbar={props.navbar}
                    assessmentTasks={props.assessmentTasks}
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