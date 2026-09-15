import { test, expect, jest } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TextArea from "../TextArea";

function makeNavbar(isReadOnly: boolean) {
    return { state: { chosenCompleteAssessmentTaskIsReadOnly: isReadOnly } };
}

test("TextArea.test.tsx Test 1: should render with the current value", () => {
    render(
        <TextArea
            navbar={makeNavbar(false)}
            setComments={jest.fn()}
            currentValue="Needs more detail"
            autosave={jest.fn()}
        />
    );

    expect(screen.getByPlaceholderText("Comments for improvement...")).toHaveValue("Needs more detail");
});

test("TextArea.test.tsx Test 2: should call setComments and autosave when the value changes and the task is not read-only", () => {
    const setComments = jest.fn();
    const autosave = jest.fn();

    render(
        <TextArea
            navbar={makeNavbar(false)}
            setComments={setComments}
            currentValue=""
            autosave={autosave}
        />
    );

    fireEvent.change(screen.getByPlaceholderText("Comments for improvement..."), {
        target: { value: "Great work" },
    });

    expect(setComments).toHaveBeenCalledWith("Great work");
    expect(autosave).toHaveBeenCalledTimes(1);
});

test("TextArea.test.tsx Test 3: should be disabled and not call setComments/autosave when the task is read-only", () => {
    const setComments = jest.fn();
    const autosave = jest.fn();

    render(
        <TextArea
            navbar={makeNavbar(true)}
            setComments={setComments}
            currentValue="Locked comment"
            autosave={autosave}
        />
    );

    const textarea = screen.getByPlaceholderText("Comments for improvement...");
    expect(textarea).toBeDisabled();

    fireEvent.change(textarea, { target: { value: "Attempted edit" } });

    expect(setComments).not.toHaveBeenCalled();
    expect(autosave).not.toHaveBeenCalled();
});
