import { test, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DynamicLoadingSpinner from "../DynamicLoading";

test("DynamicLoading.test.tsx Test 1: should render a progressbar with default size when no props are given", () => {
    render(<DynamicLoadingSpinner />);

    const spinner = screen.getByRole("progressbar");
    expect(spinner).toBeInTheDocument();
});

test("DynamicLoading.test.tsx Test 2: should render a progressbar sized according to the size prop", () => {
    render(<DynamicLoadingSpinner size={40} thickness={70} />);

    const spinner = screen.getByRole("progressbar");
    expect(spinner).toHaveStyle({ width: "40px", height: "40px" });
});
