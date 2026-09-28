import { test, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import StatusIndicator, { StatusIndicatorState } from "../StatusIndicator";

test("StatusIndicator.test.tsx Test 1: NOT_STARTED should render a single gray outline circle", () => {
    render(<StatusIndicator status={StatusIndicatorState.NOT_STARTED} />);

    const svg = screen.getByRole("img", { hidden: true });
    expect(svg).toHaveStyle({ color: "rgb(128, 128, 128)" });
    expect(svg).toContainHTML('r="7"');
    expect(svg).not.toContainHTML('r="5"');
});

test("StatusIndicator.test.tsx Test 2: IN_PROGRESS should render an orange circle with a fill wedge", () => {
    render(<StatusIndicator status={StatusIndicatorState.IN_PROGRESS} />);

    const svg = screen.getByRole("img", { hidden: true });
    expect(svg).toHaveStyle({ color: "rgb(255, 165, 0)" });
    expect(svg).toContainHTML("<path");
});

test("StatusIndicator.test.tsx Test 3: COMPLETED should render a filled green circle", () => {
    render(<StatusIndicator status={StatusIndicatorState.COMPLETED} />);

    const svg = screen.getByRole("img", { hidden: true });
    expect(svg).toHaveStyle({ color: "rgb(0, 128, 0)" });
    expect(svg).toContainHTML('r="7"');
    expect(svg).toContainHTML('r="5"');
});

test("StatusIndicator.test.tsx Test 4: an unrecognized status should render no icon", () => {
    render(<StatusIndicator status="SOMETHING_ELSE" />);

    expect(screen.queryByRole("img", { hidden: true })).not.toBeInTheDocument();
});

test("StatusIndicator.test.tsx Test 5: should update its icon when the status prop changes", () => {
    const { rerender } = render(<StatusIndicator status={StatusIndicatorState.NOT_STARTED} />);

    expect(screen.getByRole("img", { hidden: true })).toHaveStyle({ color: "rgb(128, 128, 128)" });

    rerender(<StatusIndicator status={StatusIndicatorState.COMPLETED} />);

    expect(screen.getByRole("img", { hidden: true })).toHaveStyle({ color: "rgb(0, 128, 0)" });
});
