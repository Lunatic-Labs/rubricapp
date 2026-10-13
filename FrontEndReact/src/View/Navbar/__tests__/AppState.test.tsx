import { test, expect, jest, beforeEach, afterEach } from "@jest/globals";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import Cookies from "universal-cookie";
import { clickElementWithTestId } from "../../../testUtilities";
import AppState from "../AppState";

// These tests cover how AppState records screens in browser history, so the
// backend calls and the real screens are stubbed out. Each stub screen can
// switch to the other through navbar.setNewTab, the way real screens do.
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
        <button data-testid="go-to-roster" onClick={() => navbar.setNewTab("Users")}>Courses screen</button>
    ),
}));

jest.mock("../../Admin/View/ViewDashboard/RosterDashboard", () => ({
    __esModule: true,
    default: () => <div data-testid="roster-screen">Roster screen</div>,
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

function renderAppState() {
    return render(<AppState userName="Test User" logout={jest.fn()} />);
}

test("AppState.test.tsx Test 1: browser Back should return to the previous screen", async () => {
    renderAppState();
    clickElementWithTestId("go-to-roster");
    expect(screen.getByTestId("roster-screen")).toBeInTheDocument();

    window.history.back();

    expect(await screen.findByTestId("go-to-roster")).toBeInTheDocument();
    expect(screen.queryByTestId("roster-screen")).not.toBeInTheDocument();
});

test("AppState.test.tsx Test 2: browser Forward should return to the screen the user went Back from", async () => {
    renderAppState();
    clickElementWithTestId("go-to-roster");
    window.history.back();
    await screen.findByTestId("go-to-roster");

    window.history.forward();

    expect(await screen.findByTestId("roster-screen")).toBeInTheDocument();
});

test("AppState.test.tsx Test 3: mounting should not add a history entry, and each screen change should add one", () => {
    const lengthBefore = window.history.length;

    renderAppState();
    expect(window.history.length).toBe(lengthBefore);

    clickElementWithTestId("go-to-roster");
    expect(window.history.length).toBe(lengthBefore + 1);
});

test("AppState.test.tsx Test 4: after a remount, Back should ignore entries left by the earlier AppState", async () => {
    const { unmount } = renderAppState();
    clickElementWithTestId("go-to-roster");
    unmount();

    // As after logging out and back in: the earlier screens are still in history.
    renderAppState();
    clickElementWithTestId("go-to-roster");
    window.history.back();
    await screen.findByTestId("go-to-roster");

    // This Back lands on the earlier AppState's roster entry, which must not
    // be restored.
    const popped = new Promise((resolve) => window.addEventListener("popstate", resolve, { once: true }));
    window.history.back();
    await popped;

    expect(screen.getByTestId("go-to-roster")).toBeInTheDocument();
});
