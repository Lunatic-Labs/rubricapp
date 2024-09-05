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
    demoAdminPassword,
    demoTaInstructorPassword,
    demoStudentPassword
} from "../../../../../App.js";



var lf = "loginForm";
var ei = "emailInput";
var pi = "passwordInput";
var ct = "coursesTitle";
var vcib = "viewCourseIconButton";
var rt = "rosterTitle";
var tt = "teamsTab";
var td = "teamDashboard";



test("NOTE: Tests 1-??? will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});


test("AdminViewTeams.test.js Test 1: should render Login Form component", () => {
    render(<Login />);

    expectElementWithAriaLabelToBeInDocument(lf);
});


test("AdminViewTeams.test.js Test 2: Should render the Team Dashboard in Admin View",  async () => {
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

    clickElementWithAriaLabel(tt);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(td);
    });

});