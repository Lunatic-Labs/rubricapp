import { test, expect } from "@jest/globals";
import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../../../../Login/Login";

import {
    clickElementWithTestId,
    expectElementWithTestIdToBeInDocument,
    changeElementWithTestIdWithInput,
    clickFirstElementWithTestId
} from "../../../../../testUtilities";


var lb = "login-submit-button";
var ei = "login-email-input";
var pi = "login-password-input";
var ct = "courses-title";
var vcib = "view-course-icon-button";
var rt = "roster-title";
var sbub = "student-bulk-upload-button";
var abut = "admin-bulk-upload-title";
var mhbb = "main-header-back-button";
var abucfb = "admin-bulk-upload-choose-file-button";
var abuufb = "admin-bulk-upload-upload-file-button";
var cabub = "cancel-admin-bulk-upload-button";
var tt = "teams-tab";
var td = "team-dashboard";
var abub = "admin-bulk-upload-button";
test("NOTE: Tests 1-10 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});
test("AdminBulkUpload.test.tsx Test 1: Should render the AdminBulkUpload component given the Student Bulk Upload button is clicked", async () => {
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

    clickElementWithTestId(sbub);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(abut);
    });
});
test("AdminBulkUpload.test.tsx Test 2: Should render the roster dashboard if the back button on the Student Bulk Upload page is clicked", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(sbub);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(abut);
    });

    clickElementWithTestId(mhbb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });
});
test("AdminBulkUpload.test.tsx Test 3: Should render your files when the Choose File button is clicked on Student Bulk Upload page", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(sbub);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(abut);
    });

    clickElementWithTestId(abucfb);
});


// test("AdminBulkUpload.test.tsx Test 4: Should render an error message when no file is uploaded on Student Bulk Upload page", async () => {
//     render(<Login />);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(ct);
//     });

//     clickFirstElementWithTestId(vcib);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(rt);
//     });

//     clickElementWithTestId(sbub);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(abut);
//     });

//     clickElementWithTestId(abuufb);

//     await waitFor(() => {
//         expectElementWithTestIdToHaveErrorMessage(abuem,"Please Select a File to Upload!");
//     },{ timeout: 3000 });
// });
test("AdminBulkUpload.test.tsx Test 5: Should render the roster dashboard if the cancel button on the Student Bulk Upload page is clicked", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(sbub);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(abut);
    });

    clickElementWithTestId(cabub);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    },{ timeout: 3000 });
});
test("AdminBulkUpload.test.tsx Test 6: Should render the AdminBulkUpload component given the Team Bulk Upload button is clicked", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(tt);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(td);
    });

    await waitFor(() => {
        clickElementWithTestId(abub);
    },{ timeout: 3000 });

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(abut);
    });
});
test("AdminBulkUpload.test.tsx Test 7: Should render the roster dashboard if the back button on the Team Bulk Upload page is clicked", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(tt);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(td);
    });
    
    await waitFor(() => {
        clickElementWithTestId(abub);
    },{ timeout: 3000 });

    await waitFor(() => {        
        expectElementWithTestIdToBeInDocument(abut);
    });

    clickElementWithTestId(mhbb);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(td);
    });
});
test("AdminBulkUpload.test.tsx Test 8: Should render your files when the Choose File button is clicked on Team Bulk Upload page", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(tt);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(td);
    });

    await waitFor(() => {
        clickElementWithTestId(abub);
    },{ timeout: 3000 });

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(abut);
    });

    clickElementWithTestId(abuufb);
});


// test("AdminBulkUpload.test.tsx Test 9: Should render an error message when no file is uploaded on Team Bulk Upload page", async () => {
//     render(<Login />);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(ct);
//     });

//     clickFirstElementWithTestId(vcib);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(rt);
//     });

//     clickElementWithTestId(tt);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(td);
//     });

//     await waitFor(() => {
//         clickElementWithTestId(abub);
//     },{ timeout: 3000 });

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(abut);
//     });

//     clickElementWithTestId(abuufb);
    
//     await waitFor(() => {    
//         expectElementWithTestIdToBeInDocument(abuem);
//     });
// });
test("AdminBulkUpload.test.tsx Test 10: Should render the roster dashboard if the cancel button on the Team Bulk Upload page is clicked", async () => {
    render(<Login />);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(ct);
    });

    clickFirstElementWithTestId(vcib);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    });

    clickElementWithTestId(tt);

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(td);
    });

    await waitFor(() => {
        clickElementWithTestId(abub);
    },{ timeout: 3000 });

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(abut);
    });
    
    clickElementWithTestId(cabub) 

    await waitFor(() => {
        expectElementWithTestIdToBeInDocument(rt);
    },{ timeout: 3000 });
});