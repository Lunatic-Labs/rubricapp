// <reference types="@testing-library/jest-dom" />

import { render, cleanup } from "@testing-library/react";
import { test, expect, jest, beforeEach, afterEach } from "@jest/globals";
import Cookies from "universal-cookie";
import AppState from "../AppState";

// AppState is a single-page app with no client-side routing history (see
// trapBrowserBackNavigation's own comment in AppState.tsx) - nothing ever
// calls pushState for a "screen", so the browser has no in-app entry for its
// Back button to land on. Without the popstate guard, pressing Back exits
// the app to whatever preceded it (often a blank page) with no way back in
// short of reloading. These tests pin that guard's two halves: it re-traps
// on every popstate while mounted, and it stops once unmounted.
//
// AppState's constructor redirects to "/" unless it finds a logged-in
// user's access_token + user cookies, bailing out before componentDidMount
// (and the popstate listener it registers) ever runs - so a logged-in
// cookie has to be mocked for the component to reach that code at all.

jest.mock("universal-cookie");
jest.mock("../../../App", () => ({ apiUrl: "http://localhost:5000/api" }));

const MockedCookies = Cookies as jest.MockedClass<typeof Cookies>;

beforeEach(() => {
    const cookieStore: Record<string, any> = {
        access_token: "mock_access_token",
        user: { user_id: 1, first_name: "Test", last_name: "User", user_dark_mode: false },
    };
    MockedCookies.mockImplementation(() => ({
        get: jest.fn((key: string) => cookieStore[key]),
        set: jest.fn((key: string, val: any) => { cookieStore[key] = val; }),
        remove: jest.fn((key: string) => { delete cookieStore[key]; }),
    }) as any);

    // componentDidMount always fetches /role regardless of auth state; stub
    // it out so the test stays fast and offline instead of hitting a real
    // (possibly absent) backend.
    jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, content: { roles: [] } }),
    } as Response);
});

afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
});

test("AppState.test.tsx Test 1: mounting pushes the current URL so there is an in-app history entry to land on", () => {
    const pushStateSpy = jest.spyOn(window.history, "pushState");

    render(<AppState logout={jest.fn()} />);

    expect(pushStateSpy).toHaveBeenCalledWith(null, "", window.location.href);
});

test("AppState.test.tsx Test 2: a popstate event re-pushes the current URL, keeping the user in the app", () => {
    const pushStateSpy = jest.spyOn(window.history, "pushState");

    render(<AppState logout={jest.fn()} />);
    pushStateSpy.mockClear(); // drop the initial push from mounting (Test 1)

    window.dispatchEvent(new PopStateEvent("popstate"));

    expect(pushStateSpy).toHaveBeenCalledTimes(1);
    expect(pushStateSpy).toHaveBeenCalledWith(null, "", window.location.href);
});

test("AppState.test.tsx Test 3: unmounting removes the popstate listener, so it no longer fires afterward", () => {
    const pushStateSpy = jest.spyOn(window.history, "pushState");

    const { unmount } = render(<AppState logout={jest.fn()} />);
    unmount();
    pushStateSpy.mockClear();

    window.dispatchEvent(new PopStateEvent("popstate"));

    expect(pushStateSpy).not.toHaveBeenCalled();
});
