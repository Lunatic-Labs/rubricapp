import { test, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SuccessMessage from "../SuccessMessage";

test("SuccessMessage.test.tsx Test 1: should render the success alert with the given message", () => {
    render(<SuccessMessage successMessage="Course added successfully" />);

    const alert = screen.getByLabelText("successMessageAlert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent("Course added successfully");
});

test("SuccessMessage.test.tsx Test 2: should render a different message when props change", () => {
    render(<SuccessMessage successMessage="User updated successfully" />);

    expect(screen.getByLabelText("successMessageAlert")).toHaveTextContent("User updated successfully");
});
