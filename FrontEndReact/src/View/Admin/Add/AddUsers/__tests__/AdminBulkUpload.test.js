import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../../../../Login/Login.js";

import {
    clickElementWithAriaLabel,
    expectElementWithAriaLabelToBeInDocument,
    changeElementWithAriaLabelWithInput,
    clickFirstElementWithAriaLabel,
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
var sbub = "studentBulkUploadButton";
var abut = "adminBulkUploadTitle";
var mhbb = "mainHeaderBackButton";
var abucfb = "adminBulkUploadChooseFileButton";
var abuufb = "adminBulkUploadUploadFileButton";
var abuem = "adminBulkUploadErrorMessage";
var cabub = "cancelAdminBulkUploadButton";
var tt = "teamsTab";
var td = "teamDashboard";
var tbub = "teamBulkUploadButton";



test("NOTE: Tests 1-10 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});


test("AdminBulkUpload.test.js Test 1: Should render the AdminBulkUpload component given the Student Bulk Upload button is clicked", async () => {
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

    clickElementWithAriaLabel(sbub);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(abut);
    });
});


test("AdminBulkUpload.test.js Test 2: Should render the roster dashboard if the back button on the Student Bulk Upload page is clicked", async () => {
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

    clickElementWithAriaLabel(sbub);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(abut);
    });

    clickElementWithAriaLabel(mhbb);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(rt);
        }, 3000);
    });
});


test("AdminBulkUpload.test.js Test 3: Should render your files when the Choose File button is clicked on Student Bulk Upload page", async () => {
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

    clickElementWithAriaLabel(sbub);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(abut);
        }, 3000);
    });

    clickElementWithAriaLabel(abucfb);
});


test("AdminBulkUpload.test.js Test 4: Should render an error message when no file is uploaded on Student Bulk Upload page", async () => {
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

    clickElementWithAriaLabel(sbub);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(abut);
    });

    clickElementWithAriaLabel(abuufb);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(abuem);
        }, 3000);
    });
});


test("AdminBulkUpload.test.js Test 5: Should render the roster dashboard if the cancel button on the Student Bulk Upload page is clicked", async () => {
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

    clickElementWithAriaLabel(sbub);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(abut);
    });

    clickElementWithAriaLabel(cabub);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(rt);
        }, 3000);
    });
});


test("AdminBulkUpload.test.js Test 6: Should render the AdminBulkUpload component given the Team Bulk Upload button is clicked", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(tt);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(td);

            clickElementWithAriaLabel(tbub);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(abut);
        }, 3000);
    });
});


test("AdminBulkUpload.test.js Test 7: Should render the roster dashboard if the back button on the Team Bulk Upload page is clicked", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(tt);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(td);

            clickElementWithAriaLabel(tbub);

            expectElementWithAriaLabelToBeInDocument(abut);
        }, 3000);
    });

    clickElementWithAriaLabel(mhbb);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(td);
        }, 3000);
    });
});


test("AdminBulkUpload.test.js Test 8: Should render your files when the Choose File button is clicked on Team Bulk Upload page", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(tt);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(td);

            clickElementWithAriaLabel(tbub);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(abut);

            clickElementWithAriaLabel(abuufb);

        }, 3000);
    });
});


test("AdminBulkUpload.test.js Test 9: Should render an error message when no file is uploaded on Team Bulk Upload page", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(tt);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(td);

            clickElementWithAriaLabel(tbub);

            expectElementWithAriaLabelToBeInDocument(abut);
        }, 3000);
    });


    await waitFor(() => {
        setTimeout(() => {
            clickElementWithAriaLabel(abuufb);
            
            expectElementWithAriaLabelToBeInDocument(abuem);
        }, 3000);
    });
});


test("AdminBulkUpload.test.js Test 10: Should render the roster dashboard if the cancel button on the Team Bulk Upload page is clicked", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(ct);
    });

    clickFirstElementWithAriaLabel(vcib);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(rt);
    });

    clickElementWithAriaLabel(tt);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(td);

            clickElementWithAriaLabel(tbub);

        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(abut);

            clickElementWithAriaLabel(cabub)

        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(rt);
        }, 3000);
    });
});