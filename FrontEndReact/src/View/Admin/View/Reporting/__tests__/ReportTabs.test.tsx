import { test, expect, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { clickElementWithAriaLabel } from "../../../../../testUtilities";
import TabManager from "../ReportTabs";

test("ReportTabs.test.tsx Test 1: should render a tab for each reporting section", () => {
    render(<TabManager navbar={{}} activeTab="Assessment Status" setTab={jest.fn()} />);

    expect(screen.getByLabelText("assessmentStatusTab")).toBeInTheDocument();
    expect(screen.getByLabelText("ratingAndFeedbackTab")).toBeInTheDocument();
    expect(screen.getByLabelText("exportGraphComparisonTab")).toBeInTheDocument();
});

test("ReportTabs.test.tsx Test 2: clicking the Ratings and Feedback tab should call setTab with the matching label", () => {
    const setTab = jest.fn();
    render(<TabManager navbar={{}} activeTab="Assessment Status" setTab={setTab} />);

    clickElementWithAriaLabel("ratingAndFeedbackTab");

    expect(setTab).toHaveBeenCalledWith("Ratings and Feedback");
});

test("ReportTabs.test.tsx Test 3: clicking the Export Graph Comparison tab should call setTab with the matching label", () => {
    const setTab = jest.fn();
    render(<TabManager navbar={{}} activeTab="Assessment Status" setTab={setTab} />);

    clickElementWithAriaLabel("exportGraphComparisonTab");

    expect(setTab).toHaveBeenCalledWith("Export Graph Comparison");
});

test("ReportTabs.test.tsx Test 4: should select the tab matching the given activeTab prop", () => {
    render(<TabManager navbar={{}} activeTab="Teams" setTab={jest.fn()} />);

    expect(screen.getByLabelText("ratingAndFeedbackTab")).toHaveAttribute("aria-selected", "true");
});
