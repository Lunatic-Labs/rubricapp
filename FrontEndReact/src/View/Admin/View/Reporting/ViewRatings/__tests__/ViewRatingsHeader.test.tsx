import { test, expect, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ViewRatingsHeader from "../ViewRatingsHeader";
import { AssessmentTask } from "../../../../../../types/AssessmentTask";

function makeTask(overrides: Partial<AssessmentTask>): AssessmentTask {
    return {
        assessment_task_id: 1,
        assessment_task_name: "Homework 1",
        unit_of_assessment: false,
        ...overrides,
    } as AssessmentTask;
}

test("ViewRatingsHeader.test.tsx Test 1: should render the assessment task dropdown", () => {
    const tasks = [makeTask({})];

    render(
        <ViewRatingsHeader
            navbar={{}}
            assessmentTasks={tasks}
            chosenAssessmentId=""
            setChosenAssessmentId={jest.fn()}
            csvCreation={null}
            userData={null}
        />
    );

    expect(screen.getByRole("combobox")).toBeInTheDocument();
});

test("ViewRatingsHeader.test.tsx Test 2: should not label the assignment type when no assessment is chosen", () => {
    const tasks = [makeTask({})];

    render(
        <ViewRatingsHeader
            navbar={{}}
            assessmentTasks={tasks}
            chosenAssessmentId=""
            setChosenAssessmentId={jest.fn()}
            csvCreation={null}
            userData={null}
        />
    );

    expect(screen.queryByText("Team Assignment")).not.toBeInTheDocument();
    expect(screen.queryByText("Individual Assignment")).not.toBeInTheDocument();
});

test("ViewRatingsHeader.test.tsx Test 3: should label a team assessment as \"Team Assignment\"", () => {
    const tasks = [makeTask({ assessment_task_id: 5, unit_of_assessment: true })];

    render(
        <ViewRatingsHeader
            navbar={{}}
            assessmentTasks={tasks}
            chosenAssessmentId={5}
            setChosenAssessmentId={jest.fn()}
            csvCreation={null}
            userData={null}
        />
    );

    expect(screen.getByText("Team Assignment")).toBeInTheDocument();
});

test("ViewRatingsHeader.test.tsx Test 4: should label an individual assessment as \"Individual Assignment\"", () => {
    const tasks = [makeTask({ assessment_task_id: 5, unit_of_assessment: false })];

    render(
        <ViewRatingsHeader
            navbar={{}}
            assessmentTasks={tasks}
            chosenAssessmentId={5}
            setChosenAssessmentId={jest.fn()}
            csvCreation={null}
            userData={null}
        />
    );

    expect(screen.getByText("Individual Assignment")).toBeInTheDocument();
});
