import { test, expect } from "@jest/globals";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import StatusIndicator, { StatusIndicatorState } from "../StatusIndicator";

test("StatusIndicator.test.tsx Test 1: NOT_STARTED should render a single gray outline circle", () => {
    const { container } = render(<StatusIndicator status={StatusIndicatorState.NOT_STARTED} />);

    const svg = container.querySelector("svg");
    expect(svg).toHaveStyle({ color: "gray" });
    expect(container.querySelectorAll("circle")).toHaveLength(1);
});

test("StatusIndicator.test.tsx Test 2: IN_PROGRESS should render an orange circle with a fill wedge", () => {
    const { container } = render(<StatusIndicator status={StatusIndicatorState.IN_PROGRESS} />);

    const svg = container.querySelector("svg");
    expect(svg).toHaveStyle({ color: "rgb(255, 165, 0)" });
    expect(container.querySelector("path")).toBeInTheDocument();
});

test("StatusIndicator.test.tsx Test 3: COMPLETED should render a filled green circle", () => {
    const { container } = render(<StatusIndicator status={StatusIndicatorState.COMPLETED} />);

    const svg = container.querySelector("svg");
    expect(svg).toHaveStyle({ color: "rgb(0, 128, 0)" });
    expect(container.querySelectorAll("circle")).toHaveLength(2);
});

test("StatusIndicator.test.tsx Test 4: an unrecognized status should render no icon", () => {
    const { container } = render(<StatusIndicator status="SOMETHING_ELSE" />);

    expect(container.querySelector("svg")).not.toBeInTheDocument();
});

test("StatusIndicator.test.tsx Test 5: should update its icon when the status prop changes", () => {
    const { container, rerender } = render(<StatusIndicator status={StatusIndicatorState.NOT_STARTED} />);

    expect(container.querySelector("svg")).toHaveStyle({ color: "rgb(128, 128, 128)" });

    rerender(<StatusIndicator status={StatusIndicatorState.COMPLETED} />);

    expect(container.querySelector("svg")).toHaveStyle({ color: "rgb(0, 128, 0)" });
});
