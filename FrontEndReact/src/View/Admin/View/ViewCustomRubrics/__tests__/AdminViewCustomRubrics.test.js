import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../../../../Login/Login.js";

import {
    clickElementWithAriaLabel,
    expectElementWithAriaLabelToBeInDocument,
    changeElementWithAriaLabelWithInput,
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
var mhbb = "mainHeaderBackButton";
var vmcrb = "viewMyCustomRubricsButton";
var acrt = "addCustomRubricTitle";
var mcracrb = "myCustomRubricsAddCustomRubricButton"



test("NOTE: Tests 1-_ will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});


test("AdminViewCustomRubrics.test.js Test 1: Should render the View Custom Rubrics page if the My Custom Rubrics button is clicked", async () => {
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

    await waitFor(() => {
        clickElementWithAriaLabel(vmcrb)
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(acrt);
        }, 3000);
    });
});


test("AdminViewCustomRubrics.test.js Test 2: Should render the Add Custom Rubrics page if the Add Custom Rubrics button is clicked", async () => {
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

    await waitFor(() => {
        clickElementWithAriaLabel(vmcrb);
    });

    await waitFor(() => {
        setTimeout(() => {
            clickElementWithAriaLabel(mcracrb);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(acrt);
        }, 3000);
    });
});


test("AdminViewCustomRubrics.test.js Test 3: Should render the Assessment Dashboard if the Back button on the My Custom Rubrics page is clicked", async () => {
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

    await waitFor(() => {
        clickElementWithAriaLabel(vmcrb)
    });

    await waitFor(() => {
        setTimeout(() => {
            clickElementWithAriaLabel(mhbb);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(adt);
        }, 3000);
    });
});