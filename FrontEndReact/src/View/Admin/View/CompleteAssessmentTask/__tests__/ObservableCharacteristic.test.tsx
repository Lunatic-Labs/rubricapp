import { test, expect, jest } from "@jest/globals";
import { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ObservableCharacteristic from "../ObservableCharacteristic";

function makeNavbar(isReadOnly: boolean) {
    return { state: { chosenCompleteAssessmentTaskIsReadOnly: isReadOnly } };
}

// ObservableCharacteristic's componentDidUpdate re-syncs `checked` from props, so a
// realistic click round-trip needs a parent that actually feeds the updated
// characteristics string back in, the way the real caller does.
function ObservableCharacteristicHarness({
    autosave,
    onSetObservableCharacteristics,
}: {
    autosave: () => void;
    onSetObservableCharacteristics?: (newData: string) => void;
}) {
    const [observableCharacteristics, setObservableCharacteristics] = useState(["0", "0", "0"]);

    return (
        <ObservableCharacteristic
            navbar={makeNavbar(false)}
            id={1}
            observableCharacteristics={observableCharacteristics}
            observableCharacteristic="Communicates clearly"
            setObservableCharacteristics={(newData) => {
                onSetObservableCharacteristics?.(newData);
                setObservableCharacteristics(newData.split(""));
            }}
            autosave={autosave}
        />
    );
}

test("ObservableCharacteristic.test.tsx Test 1: should render unchecked when the corresponding characteristic flag is not \"1\"", () => {
    render(
        <ObservableCharacteristic
            navbar={makeNavbar(false)}
            id={1}
            observableCharacteristics={["0", "0", "0"]}
            observableCharacteristic="Communicates clearly"
            setObservableCharacteristics={jest.fn()}
            autosave={jest.fn()}
        />
    );

    expect(screen.getByRole("checkbox")).not.toBeChecked();
    expect(screen.getByText("Communicates clearly")).toBeInTheDocument();
});

test("ObservableCharacteristic.test.tsx Test 2: should render checked when the corresponding characteristic flag is \"1\"", () => {
    render(
        <ObservableCharacteristic
            navbar={makeNavbar(false)}
            id={1}
            observableCharacteristics={["0", "1", "0"]}
            observableCharacteristic="Communicates clearly"
            setObservableCharacteristics={jest.fn()}
            autosave={jest.fn()}
        />
    );

    expect(screen.getByRole("checkbox")).toBeChecked();
});

test("ObservableCharacteristic.test.tsx Test 3: clicking should toggle the checkbox and report the updated characteristics string", () => {
    const autosave = jest.fn();

    render(<ObservableCharacteristicHarness autosave={autosave} />);

    fireEvent.click(screen.getByRole("checkbox"));

    expect(screen.getByRole("checkbox")).toBeChecked();
    expect(autosave).toHaveBeenCalledTimes(1);
});

test("ObservableCharacteristic.test.tsx Test 4: should be disabled and ignore clicks when the task is read-only", () => {
    const setObservableCharacteristics = jest.fn();
    const autosave = jest.fn();

    render(
        <ObservableCharacteristic
            navbar={makeNavbar(true)}
            id={0}
            observableCharacteristics={["0"]}
            observableCharacteristic="Communicates clearly"
            setObservableCharacteristics={setObservableCharacteristics}
            autosave={autosave}
        />
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeDisabled();

    fireEvent.click(checkbox);

    expect(setObservableCharacteristics).not.toHaveBeenCalled();
    expect(autosave).not.toHaveBeenCalled();
});

test("ObservableCharacteristic.test.tsx Test 5: should sync its checked state when the observableCharacteristics prop changes externally", () => {
    const { rerender } = render(
        <ObservableCharacteristic
            navbar={makeNavbar(false)}
            id={0}
            observableCharacteristics={["0"]}
            observableCharacteristic="Communicates clearly"
            setObservableCharacteristics={jest.fn()}
            autosave={jest.fn()}
        />
    );

    expect(screen.getByRole("checkbox")).not.toBeChecked();

    rerender(
        <ObservableCharacteristic
            navbar={makeNavbar(false)}
            id={0}
            observableCharacteristics={["1"]}
            observableCharacteristic="Communicates clearly"
            setObservableCharacteristics={jest.fn()}
            autosave={jest.fn()}
        />
    );

    expect(screen.getByRole("checkbox")).toBeChecked();
});
