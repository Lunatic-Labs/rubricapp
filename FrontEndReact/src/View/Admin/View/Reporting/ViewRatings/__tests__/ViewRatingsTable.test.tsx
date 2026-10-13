import { test, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ViewRatingsTable from "../ViewRatingsTable";
import { AssessmentTask } from "../../../../../../types/AssessmentTask";
import { Category } from "../../../../../../types/Category";

const teamTask = {
    assessment_task_id: 1,
    assessment_task_name: "Team Project",
    unit_of_assessment: true,
} as AssessmentTask;

const categories = [{ category_name: "Teamwork" }] as Category[];

const ratingData = { Teamwork: { rating: 3 } };

// One row per team member, as Rating_routes sends them for a team task.
function memberRow(teamName: string, userId: number | null, firstName: string | null, lastName: string | null) {
    return {
        team_name: teamName,
        rating_observable_characteristics_suggestions_data: ratingData,
        first_name: firstName,
        last_name: lastName,
        lag_time: null,
        notification_sent: false,
        is_assessor: false,
        user_id: userId,
    };
}

test("ViewRatingsTable.test.tsx Test 1: a team with no members should show its ratings without an 'Unknown' member", () => {
    render(
        <ViewRatingsTable
            navbar={{}}
            assessmentTasks={[teamTask]}
            chosenAssessmentId={1}
            categories={categories}
            ratings={[
                memberRow("Alpha", 7, "Ada", "Lovelace"),
                memberRow("Empty", null, null, null),
            ]}
        />
    );

    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("Empty")).toBeInTheDocument();
    expect(screen.queryByText("Unknown")).not.toBeInTheDocument();
});
