import { test, expect } from "@jest/globals";
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../../../../Login/Login";

import {
    clickElementWithTestId,
    expectElementWithTestIdToBeInDocument,
    changeElementWithTestIdWithInput,
    clickFirstElementWithTestId,
    expectElementWithTestIdToHaveErrorMessage
} from "../../../../../testUtilities";


var lb = "login-submit-button";
var ei = "login-email-input";
var pi = "login-password-input";
var ct = "courses-title";
var vcib = "view-course-icon-button";
var rt = "roster-title";
var at = "assessment-tab";
var adt = "assessment-dashboard-title";
var atb = "add-task-button";
var aaatt = "admin-add-assessment-task-title";
var aaacb = "admin-add-assessment-cancel-button"
var aagaro = "add-assessment-group-assessment-radio-option";
var aaiaro = "add-assessment-individual-assessment-radio-option";
var aatp = "add-assessment-team-password";
var aacoub = "add-assessment-create-or-update-button";
var aatn = "add-assessment-task-name";
var aard = "add-assessment-rubric-dropdown";
var aatd = "add-assessment-timezone-dropdown";
var aan = "add-assessment-notes";
test("NOTE: Tests 1-8 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});
test("AdminAddAssessmentTask.test.tsx Test 1: Should render the Add Assessment Task Form given the Add Task button is clicked", async () => {
    render(<Login />);

    changeElementWithTestIdWithInput(ei, "demoadmin02@skillbuilder.edu");

    changeElementWithTestIdWithInput(pi, globalThis.DEMO_ADMIN_PASSWORD);

    clickElementWithTestId(lb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(at);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(adt);
    });

    clickElementWithTestId(atb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(aaatt);
    });
});
test("AdminAddAssessmentTask.test.tsx Test 2: Should render the Assessment dashboard if the cancel button is clicked", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(at);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(adt);
    });
    
    clickElementWithTestId(atb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(aaatt);
    });

    clickElementWithTestId(aaacb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(adt);
    },{ timeout: 3000 });
});
test("AdminAddAssessmentTask.test.tsx Test 3: Should render the Password text field if the Team Assessment option is clicked for Unit of Assessment", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(at);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(adt);
    });
    
    clickElementWithTestId(atb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(aaatt);
    });

    clickElementWithTestId(aagaro);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(aatp);
    });
});
test("AdminAddAssessmentTask.test.tsx Test 4: Should provide a HelperText error when Task Name is left empty", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(at);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(adt);
    });

    clickElementWithTestId(atb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(aaatt);
    });

    clickElementWithTestId(aacoub);

    await waitFor(() => {
        expectElementWithTestIdToHaveErrorMessage(aatn, "Task Name cannot be empty");
    });
});
test("AdminAddAssessmentTask.test.tsx Test 5: Should return back to the Assessment View page if all valid information is provided and the Add Assessment button is clicked", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(at);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(adt);
    });

    clickElementWithTestId(atb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(aaatt);
    });

    clickElementWithTestId(aatn);

    // The backend has no assessment-task-delete endpoint, so this test can't
    // clean up after itself; a unique name per run keeps repeat runs from
    // colliding with a task an earlier run already created. Generated once
    // here rather than inside waitFor, whose callback re-runs on retry and
    // would otherwise type a different name each attempt.
    var taskName = `Make a class ${Date.now()}`;

    await waitFor(() => {
        changeElementWithTestIdWithInput(aatn, taskName);
    });

    await waitFor(() => {
        clickElementWithTestId(aard);
    
        clickFirstElementWithTestId(aaiaro);
    
        clickElementWithTestId(aatd);
    },{ timeout: 3000 });

    
    await waitFor(() => {
        changeElementWithTestIdWithInput(aan, "Good luck!");
    });
    
    clickElementWithTestId(aacoub);
});


// test("AdminAddAssessmentTask.test.tsx Test 6: Should provide a HelperText error when no option is selected in the Time Zone Dropdown", async () => {
//     render(<Login />);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(ct);
//     });

//     clickFirstElementWithTestId(vcib);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(rt);
//     });

//     clickElementWithTestId(at);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(adt);
//     });

//     clickElementWithTestId(atb);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(aaatt);
//     });

//     clickElementWithTestId(aacoub);

//     await waitFor(() => {
//         expectElementWithTestIdToHaveErrorMessage(aatd, "Time Zone cannot be empty");
//     });
// });


// test("AdminAddAssessmentTask.test.tsx Test 7: Should provide a HelperText error when no option is selected in the Rubric Dropdown", async () => {
//     render(<Login />);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(ct);
//     });

//     clickFirstElementWithTestId(vcib);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(rt);
//     });

//     clickElementWithTestId(at);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(adt);
//     });

//     clickElementWithTestId(atb);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(aaatt);
//     });

//     clickElementWithTestId(aacoub);

//     await waitFor(() => {
//         expectElementWithTestIdToHaveErrorMessage(aard, "Rubric cannot be empty");
//     });
// });
test("AdminAddAssessmentTask.test.tsx Test 8: Should provide a HelperText error when Instructions to Students/TA's is left empty", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(at);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(adt);
    });

    clickElementWithTestId(atb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(aaatt);
    });

    clickElementWithTestId(aacoub);

    await waitFor(() => {
        expectElementWithTestIdToHaveErrorMessage(aan, "Assessment Notes cannot be empty");
    });
});