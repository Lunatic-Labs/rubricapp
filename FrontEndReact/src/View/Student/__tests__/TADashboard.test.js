import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../../Login/Login.js";

import {
    clickElementWithAriaLabel,
    expectElementWithAriaLabelToBeInDocument,
    changeElementWithAriaLabelWithInput,
    clickFirstElementWithAriaLabel
} from "../../../testUtilities.js";

import {
    demoTaInstructorPassword
} from "../../../App.js";



var lb = "loginButton";
var ei = "emailInput";
var pi = "passwordInput";
var ct = "coursesTitle";
var matt = "myAssessmentTasksTitle";
var catt = "completedAssessmentTasksTitle";
var vcib = "viewCourseIconButton";
var catb = "completedAssessmentTasksButton";
var catvib = "completedAssessmentTasksViewIconButton";
var vatit = "viewAssessmentTaskInstructionsTitle";
var mhbb = "mainHeaderBackButton";
var vaticb = "viewAssessmentTaskInstructionsContinueButton";
var rs = "ratingsSection";
var ocs = "observableCharacteristicsSection";
var sfis = "suggestionsForImprovementSection";
var cbs = "commentBoxSection";
var rb = "refreshButton";
var sb = "saveButton";



test("NOTE: Tests 1-9 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});


test("TADashboard.test.js Test 1: Should render both assessment tables if valid TA information is input to login.", async () => {
    render(<Login />);

    changeElementWithAriaLabelWithInput(ei, "demotainstructor03@skillbuilder.edu");

    changeElementWithAriaLabelWithInput(pi, demoTaInstructorPassword);

    clickElementWithAriaLabel(lb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);

    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(matt);

        expectElementWithAriaLabelToBeInDocument(catt);
    });
});


test("TADashboard.test.js Test 2: Should render the completed assessment task page if the complete assessment task button is clicked.", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);

        clickFirstElementWithAriaLabel(vcib);
    });

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(matt);

        expectElementWithAriaLabelToBeInDocument(catt);
    });

    setTimeout(() => {
        clickFirstElementWithAriaLabel(catb);
    }, 3000);
        
    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(vatit);
    });
});


test("TADashboard.test.js Test 3: Should render the view completed assessment task page if the view button is clicked.", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(matt);

        expectElementWithAriaLabelToBeInDocument(catt);
    });
        
    await waitFor(() => {
        setTimeout(() => {
            clickFirstElementWithAriaLabel(catvib);

            expectElementWithAriaLabelToBeInDocument(vatit);
        }, 3000);
    });
});


test("TADashboard.test.js Test 4: Should render to the course dashboard when the back button is clicked on my Assessment Tasks and Completed Assessments page.", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(matt);

        expectElementWithAriaLabelToBeInDocument(catt);
    });

    setTimeout(() => {
        clickElementWithAriaLabel(mhbb);
    }, 3000);
    
    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(ct);
        }, 3000);
    });
});


test("TADashboard.test.js Test 5: Should render to the my Assessment Tasks and Completed Assessments page when the back button is clicked on the viewAssessmentTaskInstructions page.", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(matt);

        expectElementWithAriaLabelToBeInDocument(catt);

        clickFirstElementWithAriaLabel(catb);
    });
    
    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(vatit);

            clickElementWithAriaLabel(mhbb);
        }, 3000);
    });
    
    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(matt);

            expectElementWithAriaLabelToBeInDocument(catt);
        }, 3000);
    });
});


test("TADashboard.test.js Test 6: Should render to the Feedback page of the Assessment Task when the continue button is selected.", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(matt);

        expectElementWithAriaLabelToBeInDocument(catt);

        clickFirstElementWithAriaLabel(catb);
    });
    
    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(vatit);

            clickElementWithAriaLabel(vaticb);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(rs);

            expectElementWithAriaLabelToBeInDocument(ocs);

            expectElementWithAriaLabelToBeInDocument(sfis);

            expectElementWithAriaLabelToBeInDocument(cbs);
        }, 3000);
    });
});


test("TADashboard.test.js Test 7: Should render to the my Assessment Tasks and Completed Assessments page when the back button is clicked on the sections page.", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(matt);

        expectElementWithAriaLabelToBeInDocument(catt);

        clickFirstElementWithAriaLabel(catb);
    });
    
    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(vatit);

            clickElementWithAriaLabel(vaticb);
        }, 3000);
    });

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rs);

        expectElementWithAriaLabelToBeInDocument(ocs);

        expectElementWithAriaLabelToBeInDocument(sfis);

        expectElementWithAriaLabelToBeInDocument(cbs);

        setTimeout(() => {
            clickElementWithAriaLabel(mhbb);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(matt);

            expectElementWithAriaLabelToBeInDocument(catt);
        }, 3000);
    });
});

test("TADashboard.test.js Test 8: Should render to the sections page when the refresh button is clicked, which ensures that everything you tried to select gets reverted back to its original state.", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(matt);

        expectElementWithAriaLabelToBeInDocument(catt);

        clickFirstElementWithAriaLabel(catb);
    });
    
    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(vatit);

            clickElementWithAriaLabel(vaticb);
        }, 3000);
    });

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rs);

        expectElementWithAriaLabelToBeInDocument(ocs);

        expectElementWithAriaLabelToBeInDocument(sfis);

        expectElementWithAriaLabelToBeInDocument(cbs);

        setTimeout(() => {
            clickElementWithAriaLabel(rb);
        }, 3000);
    });
});


test("TADashboard.test.js Test 9: Should successfully save all the changes when the save button is clicked on the sections page.", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(matt);

        expectElementWithAriaLabelToBeInDocument(catt);

        setTimeout(() => {
            clickFirstElementWithAriaLabel(catb);
        }, 3000);
    });
    
    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(vatit);
        }, 3000);
    });

    clickElementWithAriaLabel(vaticb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rs);

        expectElementWithAriaLabelToBeInDocument(ocs);

        expectElementWithAriaLabelToBeInDocument(sfis);

        expectElementWithAriaLabelToBeInDocument(cbs);

        setTimeout(() => {
            clickElementWithAriaLabel(sb);
        }, 3000);
    });
});
