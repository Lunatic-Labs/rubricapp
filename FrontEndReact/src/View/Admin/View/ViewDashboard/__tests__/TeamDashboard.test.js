import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../../../../Login/Login.js';

import {
    clickElementWithAriaLabel,
    expectElementWithAriaLabelToBeInDocument,
    changeElementWithAriaLabelWithInput,
    clickFirstElementWithAriaLabel
} from '../../../../../testUtilities.js';

import {
    demoAdminPassword
} from '../../../../../App.js';



var lb = 'loginButton';
var ei = 'emailInput';
var pi = 'passwordInput';
var ct = 'coursesTitle';
var vcib = "viewCourseIconButton";
var vcmh = "viewCourseMainHeader";
var mhbb = "mainHeaderBackButton";
var tt = "teamsTab";
var rt = "rosterTitle";
var td = "teamDashboard";
var abub = "adminBulkUploadButton";
var abu = "adminBulkUpload";
var aatb = "adminAddTeamButton";
var aatt = "adminAddTeamTitle";
var vtib = "viewTeamsIconButton";
var avtmt = "adminViewTeamMembersTitle";



test("NOTE: Tests 1-5 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});


test('TeamDashboard.test.js Test 1: Should render the TeamDashboard', async () => {
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

    clickElementWithAriaLabel(tt);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(td);
        }, 3000);
    });
});


test('TeamDashboard.test.js Test 2: Should render the Admin Bulk Upload page if the adminBulkUpload button is clicked', async () => {
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

    clickElementWithAriaLabel(tt);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(td);

            clickElementWithAriaLabel(abub);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(abu);
        }, 3000);
    });
});


test('TeamDashboard.test.js Test 3: Should render the Add Team page if the adminAddTeam button is clicked', async () => {
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

    clickElementWithAriaLabel(tt);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(td);

            clickElementWithAriaLabel(aatb);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(aatt);
        }, 3000);
    });
});


test('TeamDashboard.test.js Test 4: Should render the View Team page if the adminViewTeam button is clicked', async () => {
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

    clickElementWithAriaLabel(tt);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(td);

            clickElementWithAriaLabel(vtib);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(avtmt);
        }, 3000);
    });
});


test('MainHeader.test.js Test 5: Clicking the back button on the page should go to the page that came before the current (ViewCourseAdmin)', async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(vcmh);
        }, 3000);
    });

    await waitFor(() => {
        clickElementWithAriaLabel(mhbb);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(ct);
        }, 3000);
    });
});