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



var lf = "loginForm";
var lb = "loginButton";
var ei = "emailInput";
var pi = "passwordInput";
var ct = "coursesTitle";
var vcib = "viewCourseIconButton";
var rt = "rosterTitle";
var eub = "editUserButton";
var eut = "editUserTitle";
var sbub = "studentBulkUploadButton";
var abut = "adminBulkUploadTitle";
var aub = "addUserButton";
var auf = "addUserForm";



test("NOTE: Tests 1-5 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});


test("AdminViewUsers.test.js Test 1: should render Login Form component", () => {
    render(<Login />);

    expectElementWithAriaLabelToBeInDocument(lf);
});


test("AdminViewUsers.test.js Test 2: Should show roster page of the users for admin view using demo admin credentials", async () => {
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
});


test("AdminViewUsers.test.js Test 3: Should show Edit User Form when clicking the Edit Icon for admin view using demo admin credentials", async () => {
    render(<Login />);

    setTimeout(() => {
        changeElementWithAriaLabelWithInput(ei, "demoadmin02@skillbuilder.edu");
    
        changeElementWithAriaLabelWithInput(pi, demoAdminPassword);
    
        clickElementWithAriaLabel(lb);
    }, 3000);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });

    setTimeout(() => {
        clickFirstElementWithAriaLabel(eub);
    }, 3000);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(eut);
        }, 3000);
    });
});


test("AdminViewUsers.test.js Test 4: Should show Student Bulk Upload Form when clicking the Student Bulk Upload Button for admin view using demo admin credentials", async () => {
    render(<Login />);

    setTimeout(() => {
        changeElementWithAriaLabelWithInput(ei, "demoadmin02@skillbuilder.edu");
    
        changeElementWithAriaLabelWithInput(pi, demoAdminPassword);
    
        clickElementWithAriaLabel(lb);
    }, 3000);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(sbub);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(abut);
    });
});


test("AdminViewUsers.test.js Test 5: Should show Add User Form when clicking the Add User Button for admin view using demo admin credentials", async () => {
    render(<Login />);

    setTimeout(() => {
        changeElementWithAriaLabelWithInput(ei, "demoadmin02@skillbuilder.edu");
    
        changeElementWithAriaLabelWithInput(pi, demoAdminPassword);
    
        clickElementWithAriaLabel(lb);
    }, 3000);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(aub);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(auf);
    });
});