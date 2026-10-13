import { test, expect, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
    clickElementWithTestId
} from "../../../testUtilities";
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
    };
}

test("ReportingHeader.test.tsx Test 1: should render the chosen course's info and the report tabs", () => {
    render(<ReportingMainHeader navbar={makeNavbar()} setTab={jest.fn()} activeTab="Assessment Status" />);

    expect(screen.getByText("Comparative Programming Languages")).toBeInTheDocument();
    expect(screen.getByTestId("assessment-status-tab")).toBeInTheDocument();
});

test("ReportingHeader.test.tsx Test 2: clicking a report tab should call setTab with the matching label", () => {
    const setTab = jest.fn();

    render(<ReportingMainHeader navbar={makeNavbar()} setTab={setTab} activeTab="Assessment Status" />);

    clickElementWithTestId("rating-and-feedback-tab");

    expect(setTab).toHaveBeenCalledWith("Ratings and Feedback");
});

test("ReportingHeader.test.tsx Test 3: should hide the Ratings and Feedback tab from a super admin", () => {
    render(<ReportingMainHeader navbar={makeNavbar(true)} setTab={jest.fn()} activeTab="Assessment Status" />);

    expect(screen.queryByTestId("rating-and-feedback-tab")).not.toBeInTheDocument();
});

// AppState renders the Reporting page's back button, above this header (see
// AppStateReportingBackButton.test.tsx). This header must not add a second one.
test("ReportingHeader.test.tsx Test 4: should not render its own back button for an admin", () => {
    render(<ReportingMainHeader navbar={makeNavbar()} setTab={jest.fn()} activeTab="Assessment Status" />);

    expect(screen.queryByTestId("main-header-back-button")).not.toBeInTheDocument();
});

test("ReportingHeader.test.tsx Test 5: should not render its own back button for a super admin", () => {
    render(<ReportingMainHeader navbar={makeNavbar(true)} setTab={jest.fn()} activeTab="Assessment Status" />);

    expect(screen.queryByTestId("main-header-back-button")).not.toBeInTheDocument();
});
