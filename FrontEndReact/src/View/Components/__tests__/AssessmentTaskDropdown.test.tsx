import { test, expect, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AssessmentTaskDropdown from "../AssessmentTaskDropdown";
import { AssessmentTask } from "../../../types/AssessmentTask";
import { selectComboBoxMenuItem } from "../../../testUtilities";

function makeTask(id: number, name: string): AssessmentTask {
    return { assessment_task_id: id, assessment_task_name: name } as AssessmentTask;
}

test("AssessmentTaskDropdown.test.tsx Test 1: should show a disabled placeholder when there are no assessment tasks", () => {
    render(
        <AssessmentTaskDropdown
            assessmentTasks={[]}
            chosenAssessmentId=""
            setChosenAssessmentId={jest.fn()}
        />
    );

    expect(screen.getAllByText("No assessment tasks available").length).toBeGreaterThan(0);
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-disabled", "true");
});

test("AssessmentTaskDropdown.test.tsx Test 2: should list every assessment task as a selectable option", async () => {
    const tasks = [makeTask(1, "Homework 1"), makeTask(2, "Homework 2")];

    render(
        <AssessmentTaskDropdown
            assessmentTasks={tasks}
            chosenAssessmentId={1}
            setChosenAssessmentId={jest.fn()}
        />
    );

    expect(screen.getByRole("combobox")).not.toHaveAttribute("aria-disabled");

    await selectComboBoxMenuItem("Assessment Task", "Homework 2");
});

test("AssessmentTaskDropdown.test.tsx Test 3: should call setChosenAssessmentId with the selected task's id", async () => {
    const tasks = [makeTask(1, "Homework 1"), makeTask(2, "Homework 2")];
    const setChosenAssessmentId = jest.fn();

    render(
        <AssessmentTaskDropdown
            assessmentTasks={tasks}
            chosenAssessmentId={1}
            setChosenAssessmentId={setChosenAssessmentId}
        />
    );

    await selectComboBoxMenuItem("Assessment Task", "Homework 2");

    expect(setChosenAssessmentId).toHaveBeenCalledWith(2);
});
