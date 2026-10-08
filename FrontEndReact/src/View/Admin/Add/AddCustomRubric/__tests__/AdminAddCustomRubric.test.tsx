import { test, expect } from "@jest/globals";
// import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
// import Login from "../../../../Login/Login";

// import {
//     clickElementWithTestId,
//     expectElementWithTestIdToBeInDocument,
//     changeElementWithTestIdWithInput,
//     expectElementWithTestIdToHaveErrorMessage,
//     clickFirstElementWithTestId
// } from "../../../../../testUtilities";


// var lb = "login-submit-button";
// var ei = "login-email-input";
// var pi = "login-password-input";
// var ct = "courses-title";
// var vcib = "view-course-icon-button";
// var rt = "roster-title";
// var at = "assessment-tab";
// var adt = "assessment-dashboard-title";
// var mhbb = "main-header-back-button";
// var cyrcrb = "customize-your-rubric-create-rubric-button";
// var cyrrn = "customize-your-rubric-rubric-name";
// var cyrrd = "customize-your-rubric-rubric-description";
// var rci = "rubric-category-icon";
// var rcn = "rubric-category-names";
// var rncb = "rubric-names-check-box";
// var ysc = "your-selected-categories";
// var vmcrb = "view-my-custom-rubrics-button";
// var mcrt = "add-custom-rubric-title";
// var acrb = "add-custom-rubric-button";
// var acyrt = "add-customize-your-rubric-title";
test("NOTE: Tests 1-6 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});


// Tests will be redone at a future time as Custom Rubrics is still making changes.


// test("AdminAddCustomRubric.test.tsx Test 1: Should render the Customize Your Rubric page given the Add Custom Rubric button is clicked.", async () => {
//     render(<Login />);

//     changeElementWithTestIdWithInput(ei, "demoadmin02@skillbuilder.edu");

//     changeElementWithTestIdWithInput(pi, globalThis.DEMO_ADMIN_PASSWORD);

//     clickElementWithTestId(lb);

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

//     clickElementWithTestId(vmcrb);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(mcrt);
//     });

//     await waitFor(() => {
//         clickElementWithTestId(mcracrb);
//     },{ timeout: 3000 });

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(acyrt);
//     });
// });


// test("AdminAddCustomRubric.test.tsx Test 2: Should render the My Custrom Rubric page if the back button on the Customize Your Rubric page is clicked.", async () => {
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

//     clickElementWithTestId(vmcrb);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(acrt);
//     });
    
//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(acyrt);
//     });

//     clickElementWithTestId(mhbb);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(acrt);
//     });
// });


// test("AdminAddCustomRubric.test.tsx Test 3: HelperText error should show for the Rubric Name field when it is left empty and the rest is filled.", async () => {
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
    
//     clickElementWithTestId(vmcrb);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(acrt);

//         setTimeout(() => {
//             clickElementWithTestId(acrb);
//         }, 3000);
//     });

//     await waitFor(() => {
//         setTimeout(() => {
//             expectElementWithTestIdToBeInDocument(acyrt);
//         }, 3000);
//     });

//     await waitFor(() => {
//         setTimeout(() => {
//             expectElementWithTestIdToBeInDocument(cyrrd,"Must follow the rules");

//             expectElementWithTestIdToBeInDocument(rncb,"Open-Minded");
//         }, 3000);
//     });

//     await waitFor(() => {
//         setTimeout(() => {
//             clickElementWithTestId(cyrcrb);

//             expectElementWithTestIdToHaveErrorMessage(cyrrn,"Missing New Rubric Name.");
//         }, 3000);
//     });
// });


// test("AdminAddCustomRubric.test.tsx Test 4: Should render an error message on the page when no input for Rubric Description is given.", async () => {
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

//     clickElementWithTestId(vmcrb);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(acrt);

//         setTimeout(() => {
//             clickElementWithTestId(acrb);
//         }, 3000);
//     });

//     await waitFor(() => {
//         setTimeout(() => {
//             expectElementWithTestIdToBeInDocument(acyrt);
//         }, 3000);
//     });

//     await waitFor(() => {
//         setTimeout(() => {
//             expectElementWithTestIdToBeInDocument(cyrrn,"Canvas Creation");

//             expectElementWithTestIdToBeInDocument(rncb,"Open-Minded");
//         }, 3000);
//     });
    
//     await waitFor(() => {
//         setTimeout(() => {
//             clickElementWithTestId(cyrcrb);

//             expectElementWithTestIdToHaveErrorMessage(cyrrd,"Missing New Rubric Description.");
//         }, 3000);
//     });
// });


// test("AdminAddCustomRubric.test.tsx Test 5: Should successfully place the selected categories from the Rubrics in the Your Selected Categories lists.", async () => {
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

//     clickElementWithTestId(vmcrb);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(acrt);

//         setTimeout(() => {
//             clickElementWithTestId(acrb);
//         }, 3000);
//     });

//     await waitFor(() => {
//         setTimeout(() => {
//             expectElementWithTestIdToBeInDocument(acyrt);
//         }, 3000);
//     });
    
//     await waitFor(() => {
//         setTimeout(() => {
//             clickFirstElementWithTestId(rci);
//         }, 3000);
//     });

//     await waitFor(() => {
//         setTimeout(() => {
//             expectElementWithTestIdToBeInDocument(rcn);
//         }, 3000);
//     });

//     await waitFor(() => {
//         setTimeout(() => {
//             clickFirstElementWithTestId(rncb);

//             expectElementWithTestIdToBeInDocument(ysc);
//         }, 3000);
//     });
// });


// test("AdminAddCustomRubric.test.tsx Test 6: Should render an error message on the page when no category from the Rubric Table is selected.", async () => {
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

//     clickElementWithTestId(vmcrb);

//     await waitFor(() => {
//         expectElementWithTestIdToBeInDocument(acrt);

//         setTimeout(() => {
//             clickElementWithTestId(acrb);
//         }, 3000);
//     });

//     await waitFor(() => {
//         setTimeout(() => {
//             expectElementWithTestIdToBeInDocument(acyrt);
//         }, 3000);
//     });

//     await waitFor(() => {
//         setTimeout(() => {
//             expectElementWithTestIdToBeInDocument(cyrrn,"Canvas Creation");

//             expectElementWithTestIdToBeInDocument(cyrrd,"Must follow the rules");
//         }, 3000);
//     });
    
//     await waitFor(() => {
//         setTimeout(() => {
//             clickElementWithTestId(cyrcrb);

//             expectElementWithTestIdToHaveErrorMessage(rncb,"At least one category must be selected");
//         }, 3000);
//     });
// });