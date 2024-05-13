import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../../../../Login/Login.js";

import {
    clickElementWithAriaLabel,
    expectElementWithAriaLabelToBeInDocument,
    changeElementWithAriaLabelWithInput,
    expectElementWithAriaLabelToHaveErrorMessage,
    clickFirstElementWithAriaLabel
} from "../../../../../testUtilities.js";

import {
    demoAdminPassword
} from "../../../../../App.js";



var lb = "loginButton";
var ei = "emailInput";
var pi = "passwordInput";
var ct = "coursesTitle";
var vcib = "viewCourseIconButton";
var rt = "rosterTitle";
var at = "assessmentTab";
var adt = "assessmentDashboardTitle";
var crb = "customRubricButton";
var acrt = "addCustomRubricTitle";
var mhbb = "mainHeaderBackButton";
var cyrcrb = "customizeYourRubricCreateRubricButton";
var cyrrn = "customizeYourRubricRubricName";
var cyrrd = "customizeYourRubricRubricDescription";
var rci = "rubricCategoryIcon";
var rcn = "rubricCategoryNames";
var rncb = "rubricNamesCheckBox";
var ysc = "yourSelectedCategories";



test("NOTE: Tests 1-5 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});


test("AdminAddCustomRubric.test.js Test 1: Should render the AdminAddCustomRubric component given the Custom Rubric button is clicked ", async () => {
    render(<Login />);

    changeElementWithAriaLabelWithInput(ei, "demoadmin02@skillbuilder.edu");

    changeElementWithAriaLabelWithInput(pi, demoAdminPassword);

    clickElementWithAriaLabel(lb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(at);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(adt);
    });

    clickElementWithAriaLabel(crb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(acrt);
    });
});


test("AdminAddCustomRubric.test.js Test 2: Should render the assessment task dashboard if the back button on the Customize Your Rubric page is clicked ", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(at);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(adt);
    });

    clickElementWithAriaLabel(crb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(acrt);
    });

    clickElementWithAriaLabel(mhbb);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(adt);
        }, 3000);
    });
});


test("AdminAddCustomRubric.test.js Test 3: HelperText error should show for the Rubric Name field when it is left empty and the rest is filled", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(at);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(adt);
    });

    clickElementWithAriaLabel(crb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(acrt);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(cyrrd,"Must follow the rules");
            expectElementWithAriaLabelToBeInDocument(rncb,"Open-Minded");
            clickElementWithAriaLabel(cyrcrb);
        }, 3000);
    });

    await waitFor(() => {
        expectElementWithAriaLabelToHaveErrorMessage(cyrrn,"Missing New Rubric Name.");
    });
});


test("AdminAddCustomRubric.test.js Test 4: Should render an error message on the page when no input for Rubric Description is given  ", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(at);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(adt);
    });

    clickElementWithAriaLabel(crb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(acrt);
    });

    await waitFor(() => {
        setTimeout(() => {
            clickElementWithAriaLabel(cyrcrb);
        }, 3000);
    });

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(cyrrd);
    });
});


test("AdminAddCustomRubric.test.js Test 5: Should successfully place the selected categories from the Rubrics in the Your Selected Categories lists ", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(at);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(adt);
    });

    clickElementWithAriaLabel(crb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(acrt);
    });

    await waitFor(() => {
        setTimeout(() => {
            clickFirstElementWithAriaLabel(rci);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(rcn);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            clickFirstElementWithAriaLabel(rncb);
        }, 3000);
    });

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ysc);
    });
});