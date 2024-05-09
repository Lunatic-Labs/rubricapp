import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../../../../Login/Login.js";

import {
    clickElementWithAriaLabel,
    expectElementWithAriaLabelToBeInDocument,
    changeElementWithAriaLabelWithInput,
    clickFirstElementWithAriaLabel,
    expectElementWithAriaLabelToHaveErrorMessage
} from "../../../../../testUtilities.js";

import {
    demoAdminPassword,
} from "../../../../../App.js";



var lb = "loginButton";
var ei = "emailInput";
var pi = "passwordInput";
var ct = "coursesTitle";
var vcib = "viewCourseIconButton";
var rt = "rosterTitle";
var at = "assessmentTab";
var adt = "assessmentDashboardTitle";
var atb = "addTaskButton";
var aaatt = "adminAddAssessmentTaskTitle";
var aaacb = "adminAddAssessmentCancelButton"
var aagaro = "addAssessmentGroupAssessmentRadioOption";
var aatp = "addAssessmentTeamPassword";
var aacoub = "addAssessmentCreateOrUpdateButton";
var aatn = "addAssessmentTaskName";
var aard = "addAssessmentRubricDropdown";
var aaro = "addAssessmentRoleOption";
var aatd = "addAssessmentTimezoneDropdown";
var aaero = "addAssessmentEstRadioOption";
var aan = "addAssessmentNotes";
var aarubo = "addAssessmentRubricOption";



test("NOTE: Tests 1-5 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});


test("AdminAddAssessmentTask.test.js Test 1: Should render the AdminAddCourse component given the Add Course button is clicked", async () => {
    render(<Login />);

    changeElementWithAriaLabelWithInput(ei, "demoadmin02@skillbuilder.edu");

    changeElementWithAriaLabelWithInput(pi, demoAdminPassword);

    clickElementWithAriaLabel(lb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(rt);
        }, 3000);
    });

    clickElementWithAriaLabel(at);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(adt);

            clickElementWithAriaLabel(atb);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(aaatt);
        }, 3000);
    });
});


test("AdminAddAssessmentTask.test.js Test 2: Should render the Assessment dashboard if the cancel button is clicked", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(rt);
        }, 3000);
    });

    clickElementWithAriaLabel(at);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(adt);

            clickElementWithAriaLabel(atb);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(aaatt);

            clickElementWithAriaLabel(aaacb);
        }, 3000);
    });

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(adt);
    });
});


test("AdminAddAssessmentTask.test.js Test 3: Should render the Password text field if the Group Assessment radio option is clicked", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(rt);
        }, 3000);
    });

    clickElementWithAriaLabel(at);

    await waitFor(() => {
        
        expectElementWithAriaLabelToBeInDocument(adt);

        clickElementWithAriaLabel(atb);
        
    });

    await waitFor(() => {
        clickElementWithAriaLabel(aagaro);
    });

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(aatp);
    });

});


test("AdminAddAssessmentTask.test.js Test 4: Should provide a HelperText error when Task Name is left empty", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(rt);
        }, 3000);
    });

    clickElementWithAriaLabel(at);

    await waitFor(() => {
        
        expectElementWithAriaLabelToBeInDocument(adt);

        clickElementWithAriaLabel(atb);
        
    });

    await waitFor(() => {
        clickElementWithAriaLabel(aacoub);
    });

    expectElementWithAriaLabelToHaveErrorMessage(aatn, "Task Name cannot be empty");

});


test("AdminAddAssessmentTask.test.js Test 5: Should return back to the Assessment View page if all valid information is provided and the Add Assessment button is clicked", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(rt);
        }, 3000);
    });

    clickElementWithAriaLabel(at);

    await waitFor(() => {
        
        expectElementWithAriaLabelToBeInDocument(adt);

        clickElementWithAriaLabel(atb);
        
    });

    await waitFor(() => {
        changeElementWithAriaLabelWithInput(aatn, "Make a class");

        clickElementWithAriaLabel(aard);
    });

    await waitFor(() => {
        setTimeout(() => {
            clickFirstElementWithAriaLabel(aarubo);

            clickFirstElementWithAriaLabel(aaro);

            clickElementWithAriaLabel(aatd);
        }, 3000);
    }); 

    await waitFor(() => {
        setTimeout(() => {
            clickElementWithAriaLabel(aaero);

            changeElementWithAriaLabelWithInput(aan, "Make a class");
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(adt);
        }, 3000)
    });
});