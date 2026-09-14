import { test, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TeamMembers from "../TeamMembers";

test("TeamMembers.test.tsx Test 1: should render a row for each team member", () => {
    const navbar = {
        studentTeamMembers: {
            users: [
                { first_name: "Ada", last_name: "Lovelace", email: "ada@example.com" },
                { first_name: "Alan", last_name: "Turing", email: "alan@example.com" },
            ],
        },
    };

    render(<TeamMembers navbar={navbar} />);

    expect(screen.getByText("Ada")).toBeInTheDocument();
    expect(screen.getByText("Lovelace")).toBeInTheDocument();
    expect(screen.getByText("alan@example.com")).toBeInTheDocument();
});

test("TeamMembers.test.tsx Test 2: should render an empty table when there are no team members yet", () => {
    const navbar = { studentTeamMembers: { users: undefined } };

    render(<TeamMembers navbar={navbar} />);

    expect(screen.getByText(/First Name/i)).toBeInTheDocument();
    expect(screen.queryByText("@example.com", { exact: false })).not.toBeInTheDocument();
});
