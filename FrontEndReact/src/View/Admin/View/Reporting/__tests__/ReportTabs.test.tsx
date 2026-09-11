import { test, expect, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { clickElementWithAriaLabel } from "../../../../../testUtilities";
import TabManager from "../ReportTabs";

// AppState receives isSuperAdmin as a prop, so the flag lives under props on the
// navbar it passes down. A bare {} here would crash the render.
function makeNavbar(isSuperAdmin = false) {
    return { props: { isSuperAdmin } };
}

test("ReportTabs.test.tsx Test 1: should render a tab for each reporting section", () => {
    render(<TabManager navbar={makeNavbar()} activeTab="Assessment Status" setTab={jest.fn()} />);

    expect(screen.getByLabelText("assessmentStatusTab")).toBeInTheDocument();
    expect(screen.getByLabelText("ratingAndFeedbackTab")).toBeInTheDocument();
    expect(screen.getByLabelText("exportGraphComparisonTab")).toBeInTheDocument();
});

test("ReportTabs.test.tsx Test 2: clicking the Ratings and Feedback tab should call setTab with the matching label", () => {
    const setTab = jest.fn();
    render(<TabManager navbar={makeNavbar()} activeTab="Assessment Status" setTab={setTab} />);

    clickElementWithAriaLabel("ratingAndFeedbackTab");

    expect(setTab).toHaveBeenCalledWith("Ratings and Feedback");
});

test("ReportTabs.test.tsx Test 3: clicking the Export Graph Comparison tab should call setTab with the matching label", () => {
    const setTab = jest.fn();
    render(<TabManager navbar={makeNavbar()} activeTab="Assessment Status" setTab={setTab} />);

    clickElementWithAriaLabel("exportGraphComparisonTab");

    expect(setTab).toHaveBeenCalledWith("Export Graph Comparison");
});

test("ReportTabs.test.tsx Test 4: should initialize the selected tab index from the activeTab prop", () => {
    render(<TabManager navbar={makeNavbar()} activeTab="Ratings and Feedback" setTab={jest.fn()} />);

    expect(screen.getByLabelText("ratingAndFeedbackTab")).toHaveAttribute("aria-selected", "true");
});

test("ReportTabs.test.tsx Test 5: should hide the Ratings and Feedback tab from a super admin", () => {
    render(<TabManager navbar={makeNavbar(true)} activeTab="Assessment Status" setTab={jest.fn()} />);

    expect(screen.queryByLabelText("ratingAndFeedbackTab")).not.toBeInTheDocument();

    // The other two are unaffected.
    expect(screen.getByLabelText("assessmentStatusTab")).toBeInTheDocument();
    expect(screen.getByLabelText("exportGraphComparisonTab")).toBeInTheDocument();
});

test("ReportTabs.test.tsx Test 6: should show the Ratings and Feedback tab to an admin", () => {
    render(<TabManager navbar={makeNavbar(false)} activeTab="Assessment Status" setTab={jest.fn()} />);

    expect(screen.getByLabelText("ratingAndFeedbackTab")).toBeInTheDocument();
});

test("ReportTabs.test.tsx Test 7: should keep Export Graph Comparison selectable for a super admin", () => {
    // Removing a tab shifts the ones after it. Selecting by position rather than by
    // tab would land a super admin on the wrong one here.
    const setTab = jest.fn();
    render(<TabManager navbar={makeNavbar(true)} activeTab="AssessmentTasks" setTab={setTab} />);

    expect(screen.getByLabelText("exportGraphComparisonTab")).toHaveAttribute("aria-selected", "true");

    clickElementWithAriaLabel("exportGraphComparisonTab");

    expect(setTab).toHaveBeenCalledWith("Export Graph Comparison");
});

test("ReportTabs.test.tsx Test 8: should fall back to the first tab when a super admin arrives on the hidden one", () => {
    render(<TabManager navbar={makeNavbar(true)} activeTab="Teams" setTab={jest.fn()} />);

    expect(screen.getByLabelText("assessmentStatusTab")).toHaveAttribute("aria-selected", "true");
});
