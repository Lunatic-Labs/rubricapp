import { test, expect, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { clickElementWithAriaLabel } from "../../../testUtilities";
import ReportingMainHeader from "../ReportingHeader";

function makeNavbar(isSuperAdmin = false) {
    return {
        // AppState receives isSuperAdmin as a prop, and passes itself down as the
        // navbar, so the report tabs read the flag from here.
        props: { isSuperAdmin },
        state: {
            chosenCourse: {
                course_name: "Comparative Programming Languages",
                course_number: "CS 4350",
                term: "Fall",
                year: 2026,
            },
        },
        confirmCreateResource: jest.fn(),
    };
}

test("ReportingHeader.test.tsx Test 1: should render the chosen course's info and the report tabs", () => {
    render(<ReportingMainHeader navbar={makeNavbar()} setTab={jest.fn()} activeTab="Assessment Status" />);

    expect(screen.getByText("Comparative Programming Languages")).toBeInTheDocument();
    expect(screen.getByLabelText("assessmentStatusTab")).toBeInTheDocument();
});

test("ReportingHeader.test.tsx Test 2: clicking the back button should call confirmCreateResource with the Users tab", () => {
    const navbar = makeNavbar();

    render(<ReportingMainHeader navbar={navbar} setTab={jest.fn()} activeTab="Assessment Status" />);

    clickElementWithAriaLabel("mainHeaderBackButton");

    expect(navbar.confirmCreateResource).toHaveBeenCalledWith("User", 0);
});

test("ReportingHeader.test.tsx Test 3: clicking a report tab should call setTab with the matching label", () => {
    const setTab = jest.fn();

    render(<ReportingMainHeader navbar={makeNavbar()} setTab={setTab} activeTab="Assessment Status" />);

    clickElementWithAriaLabel("ratingAndFeedbackTab");

    expect(setTab).toHaveBeenCalledWith("Ratings and Feedback");
});

test("ReportingHeader.test.tsx Test 4: should hide the Ratings and Feedback tab from a super admin", () => {
    render(<ReportingMainHeader navbar={makeNavbar(true)} setTab={jest.fn()} activeTab="Assessment Status" />);

    expect(screen.queryByLabelText("ratingAndFeedbackTab")).not.toBeInTheDocument();
});

test("ReportingHeader.test.tsx Test 5: should keep the back button for a super admin", () => {
    const navbar = makeNavbar(true);

    render(<ReportingMainHeader navbar={navbar} setTab={jest.fn()} activeTab="Assessment Status" />);

    clickElementWithAriaLabel("mainHeaderBackButton");

    expect(navbar.confirmCreateResource).toHaveBeenCalledWith("User", 0);
});
