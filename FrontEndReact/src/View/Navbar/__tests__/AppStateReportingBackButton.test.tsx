import { test, expect, jest, beforeEach, afterEach } from "@jest/globals";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import Cookies from "universal-cookie";
import { clickElementWithTestId } from "../../../testUtilities";
import AppState from "../AppState";

// The Reporting page's only back button is the one AppState renders above it,
// and its target depends on the user's role. These tests pin that target, so
// the backend calls and the real screens are stubbed out. Each starting screen
// gets a button that opens Reporting through navbar.setNewTab, the way the
// real screens do.
jest.mock("../../../utility", () => ({
    genericResourceGET: jest.fn(() => Promise.resolve(undefined)),
    parseRoleNames: jest.fn(() => ({})),
}));

jest.mock("../Navbar", () => ({
    __esModule: true,
    default: () => null,
}));

jest.mock("../../Admin/View/ViewCourses/AdminViewCourses", () => ({
    __esModule: true,
    default: ({ navbar }: { navbar: { setNewTab: (tab: string) => void } }) => (
        <button data-testid="open-reporting" onClick={() => navbar.setNewTab("Reporting")}>Courses screen</button>
    ),
}));

jest.mock("../../Admin/View/ViewUsers/AdminViewUsers", () => ({
    __esModule: true,
    default: ({ navbar }: { navbar: { setNewTab: (tab: string) => void } }) => (
        <button data-testid="open-reporting" onClick={() => navbar.setNewTab("Reporting")}>Users screen</button>
    ),
}));

jest.mock("../../Admin/View/Reporting/ReportingDashboard", () => ({
    __esModule: true,
    default: () => <div>Reporting screen</div>,
}));

jest.mock("../../Admin/View/ViewDashboard/RosterDashboard", () => ({
    __esModule: true,
    default: () => <div data-testid="roster-screen">Roster screen</div>,
}));

jest.mock("../../Admin/View/ViewDashboard/AssessmentDashboard", () => ({
    __esModule: true,
    default: () => <div>Assessment screen</div>,
}));

const cookies = new Cookies();

beforeEach(() => {
    cookies.set("access_token", "token");
    cookies.set("user", { user_id: 1 });
});

afterEach(() => {
    cleanup();
    cookies.remove("access_token");
    cookies.remove("user");
});

function openReporting(isSuperAdmin: boolean) {
    render(<AppState userName="Test User" logout={jest.fn()} isSuperAdmin={isSuperAdmin} />);
    clickElementWithTestId("open-reporting");
    expect(screen.getByTestId("reporting-dashboard")).toBeInTheDocument();
}

test("AppStateReportingBackButton.test.tsx Test 1: the Reporting page should show exactly one back button", () => {
    openReporting(false);

    expect(screen.getAllByTestId("main-header-back-button")).toHaveLength(1);
});

test("AppStateReportingBackButton.test.tsx Test 2: Back on the Reporting page should take an admin to the roster", async () => {
    openReporting(false);

    clickElementWithTestId("main-header-back-button");

    expect(await screen.findByTestId("roster-screen")).toBeInTheDocument();
    expect(screen.queryByTestId("assessment-dashboard")).not.toBeInTheDocument();
});

test("AppStateReportingBackButton.test.tsx Test 3: Back on the Reporting page should take a super admin to the assessment dashboard", async () => {
    openReporting(true);

    clickElementWithTestId("main-header-back-button");

    expect(await screen.findByTestId("assessment-dashboard")).toBeInTheDocument();
    expect(screen.queryByTestId("roster-screen")).not.toBeInTheDocument();
});
