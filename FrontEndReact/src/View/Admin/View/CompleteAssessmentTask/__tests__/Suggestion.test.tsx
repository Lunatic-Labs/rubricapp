import { test, expect, jest } from "@jest/globals";
import { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Suggestion from "../Suggestion";

function makeNavbar(isReadOnly: boolean) {
    return { state: { chosenCompleteAssessmentTaskIsReadOnly: isReadOnly } };
}

// Suggestion's componentDidUpdate re-syncs `checked` from props.suggestions, so a
// realistic click round-trip needs a parent that actually feeds the updated
// suggestions string back in, the way the real caller does.
function SuggestionHarness({ autosave }: { autosave: () => void }) {
    const [suggestions, setSuggestions] = useState(["0", "0", "0"]);

    return (
        <Suggestion
            navbar={makeNavbar(false)}
            id={1}
            suggestions={suggestions}
            suggestion="Add more examples"
            setSuggestions={(newData) => setSuggestions(newData.split(""))}
            autosave={autosave}
        />
    );
}

test("Suggestion.test.tsx Test 1: should render unchecked when the corresponding suggestion flag is not \"1\"", () => {
    render(
        <Suggestion
            navbar={makeNavbar(false)}
            id={1}
            suggestions={["0", "0", "0"]}
            suggestion="Add more examples"
            setSuggestions={jest.fn()}
            autosave={jest.fn()}
        />
    );

    expect(screen.getByRole("checkbox")).not.toBeChecked();
    expect(screen.getByText("Add more examples")).toBeInTheDocument();
});

test("Suggestion.test.tsx Test 2: should render checked when the corresponding suggestion flag is \"1\"", () => {
    render(
        <Suggestion
            navbar={makeNavbar(false)}
            id={1}
            suggestions={["0", "1", "0"]}
            suggestion="Add more examples"
            setSuggestions={jest.fn()}
            autosave={jest.fn()}
        />
    );

    expect(screen.getByRole("checkbox")).toBeChecked();
});

test("Suggestion.test.tsx Test 3: clicking should toggle the checkbox and report the updated suggestions string", () => {
    const autosave = jest.fn();

    render(<SuggestionHarness autosave={autosave} />);

    fireEvent.click(screen.getByRole("checkbox"));

    expect(screen.getByRole("checkbox")).toBeChecked();
    expect(autosave).toHaveBeenCalledTimes(1);
});

test("Suggestion.test.tsx Test 4: should be disabled and ignore clicks when the task is read-only", () => {
    const setSuggestions = jest.fn();
    const autosave = jest.fn();

    render(
        <Suggestion
            navbar={makeNavbar(true)}
            id={0}
            suggestions={["0"]}
            suggestion="Add more examples"
            setSuggestions={setSuggestions}
            autosave={autosave}
        />
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeDisabled();

    fireEvent.click(checkbox);

    expect(setSuggestions).not.toHaveBeenCalled();
    expect(autosave).not.toHaveBeenCalled();
});

test("Suggestion.test.tsx Test 5: should sync its checked state when the suggestions prop changes externally", () => {
    const { rerender } = render(
        <Suggestion
            navbar={makeNavbar(false)}
            id={0}
            suggestions={["0"]}
            suggestion="Add more examples"
            setSuggestions={jest.fn()}
            autosave={jest.fn()}
        />
    );

    expect(screen.getByRole("checkbox")).not.toBeChecked();

    rerender(
        <Suggestion
            navbar={makeNavbar(false)}
            id={0}
            suggestions={["1"]}
            suggestion="Add more examples"
            setSuggestions={jest.fn()}
            autosave={jest.fn()}
        />
    );

    expect(screen.getByRole("checkbox")).toBeChecked();
});
