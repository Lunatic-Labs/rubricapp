import { test, expect, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { clickElementWithAriaLabel } from "../../../testUtilities";
import ReportingMainHeader from "../ReportingHeader";

function makeNavbar() {
    return {
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
