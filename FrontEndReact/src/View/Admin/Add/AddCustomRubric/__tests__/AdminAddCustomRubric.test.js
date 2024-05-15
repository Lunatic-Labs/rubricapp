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
var mhbb = "mainHeaderBackButton";
var cyrcrb = "customizeYourRubricCreateRubricButton";
var cyrrn = "customizeYourRubricRubricName";
var cyrrd = "customizeYourRubricRubricDescription";
var rci = "rubricCategoryIcon";
var rcn = "rubricCategoryNames";
var rncb = "rubricNamesCheckBox";
var ysc = "yourSelectedCategories";
var vmcrb = "viewMyCustomRubricsButton";
var mcrt = "addCustomRubricTitle";
var acrb = "addCustomRubricButton";
var acyrt = "addCustomizeYourRubricTitle"



test("NOTE: Tests 1-6 will not pass if Demo Data is not loaded!", () => {
    expect(true).toBe(true);
});


test("AdminAddCustomRubric.test.js Test 1: Should render the AdminAddCustomRubric component given the Add Custom Rubric button is clicked.", async () => {
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

    clickElementWithAriaLabel(vmcrb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(mcrt);

        setTimeout(() => {
            clickElementWithAriaLabel(acrb);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(acyrt);
        }, 3000);
    });
});


test("AdminAddCustomRubric.test.js Test 2: Should render the My Custrom Rubric page if the back button on the Customize Your Rubric page is clicked.", async () => {
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

    clickElementWithAriaLabel(vmcrb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(mcrt);

        setTimeout(() => {
            clickElementWithAriaLabel(acrb);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(acyrt);
        }, 3000);
    });

    clickElementWithAriaLabel(mhbb);

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(mcrt);
        }, 3000);
    });
});


test("AdminAddCustomRubric.test.js Test 3: HelperText error should show for the Rubric Name field when it is left empty and the rest is filled.", async () => {
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
    
    clickElementWithAriaLabel(vmcrb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(mcrt);

        setTimeout(() => {
            clickElementWithAriaLabel(acrb);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(acyrt);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(cyrrd,"Must follow the rules");

            expectElementWithAriaLabelToBeInDocument(rncb,"Open-Minded");
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            clickElementWithAriaLabel(cyrcrb);

            expectElementWithAriaLabelToHaveErrorMessage(cyrrn,"Missing New Rubric Name.");
        }, 3000);
    });
});


test("AdminAddCustomRubric.test.js Test 4: Should render an error message on the page when no input for Rubric Description is given.", async () => {
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

    clickElementWithAriaLabel(vmcrb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(mcrt);

        setTimeout(() => {
            clickElementWithAriaLabel(acrb);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(acyrt);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(cyrrn,"Canvas Creation");

            expectElementWithAriaLabelToBeInDocument(rncb,"Open-Minded");
        }, 3000);
    });
    
    await waitFor(() => {
        setTimeout(() => {
            clickElementWithAriaLabel(cyrcrb);

            expectElementWithAriaLabelToHaveErrorMessage(cyrrd,"Missing New Rubric Description.");
        }, 3000);
    });
});


test("AdminAddCustomRubric.test.js Test 5: Should successfully place the selected categories from the Rubrics in the Your Selected Categories lists.", async () => {
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

    clickElementWithAriaLabel(vmcrb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(mcrt);

        setTimeout(() => {
            clickElementWithAriaLabel(acrb);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(acyrt);
        }, 3000);
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

            expectElementWithAriaLabelToBeInDocument(ysc);
        }, 3000);
    });
});


test("AdminAddCustomRubric.test.js Test 6: Should render an error message on the page when no category from the Rubric Table is selected.", async () => {
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

    clickElementWithAriaLabel(vmcrb);

    await waitFor(() => {
        expectElementWithAriaLabelToBeInDocument(mcrt);

        setTimeout(() => {
            clickElementWithAriaLabel(acrb);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(acyrt);
        }, 3000);
    });

    await waitFor(() => {
        setTimeout(() => {
            expectElementWithAriaLabelToBeInDocument(cyrrn,"Canvas Creation");

            expectElementWithAriaLabelToBeInDocument(cyrrd,"Must follow the rules");
        }, 3000);
    });
    
    await waitFor(() => {
        setTimeout(() => {
            clickElementWithAriaLabel(cyrcrb);

            expectElementWithAriaLabelToHaveErrorMessage(rncb,"At least one category must be selected");
        }, 3000);
    });
});