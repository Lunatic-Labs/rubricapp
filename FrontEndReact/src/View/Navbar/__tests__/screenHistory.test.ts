import { test, expect, jest, beforeEach, afterEach } from "@jest/globals";
import { waitFor } from "@testing-library/react";
import ScreenHistory from "../screenHistory";

interface Screen {
    tab: string;
    detail?: string;
}

let screenHistory: ScreenHistory<Screen>;
let onRestore: jest.Mock<(screen: Screen) => void>;

function makeScreenHistory(): ScreenHistory<Screen> {
    return new ScreenHistory<Screen>((screen) => screen.tab, onRestore);
}

// jsdom fires popstate asynchronously after history.back()/forward(), so wait
// for the restore before asserting on it.
async function goBackAndExpectRestore(expected: Screen): Promise<void> {
    onRestore.mockClear();
    window.history.back();
    await waitFor(() => expect(onRestore).toHaveBeenCalledWith(expected));
}

beforeEach(() => {
    onRestore = jest.fn();
    screenHistory = makeScreenHistory();
});

afterEach(() => {
    screenHistory.stop();
});

test("screenHistory.test.ts Test 1: start should tag the current entry without adding one, keeping existing history state", () => {
    window.history.replaceState({ usr: null, key: "default", idx: 0 }, "");
    const lengthBefore = window.history.length;

    screenHistory.start({ tab: "Courses" });

    expect(window.history.length).toBe(lengthBefore);
    expect(window.history.state).toMatchObject({ usr: null, key: "default", idx: 0 });
    expect(window.history.state.skillBuilderScreen).toMatchObject({ index: 0 });
});

test("screenHistory.test.ts Test 2: record should add a history entry only when the screen changes", () => {
    screenHistory.start({ tab: "Courses" });
    const lengthBefore = window.history.length;

    screenHistory.record({ tab: "Courses", detail: "loaded" });
    expect(window.history.length).toBe(lengthBefore);

    screenHistory.record({ tab: "Users" });
    expect(window.history.length).toBe(lengthBefore + 1);
    expect(window.history.state.skillBuilderScreen).toMatchObject({ index: 1 });
});

test("screenHistory.test.ts Test 3: Back should restore the previous screen as it was last recorded", async () => {
    screenHistory.start({ tab: "Courses" });
    screenHistory.record({ tab: "Courses", detail: "loaded" });
    screenHistory.record({ tab: "Users" });

    await goBackAndExpectRestore({ tab: "Courses", detail: "loaded" });
});

test("screenHistory.test.ts Test 4: Forward should restore the screen the user went Back from", async () => {
    screenHistory.start({ tab: "Courses" });
    screenHistory.record({ tab: "Users" });
    await goBackAndExpectRestore({ tab: "Courses" });

    onRestore.mockClear();
    window.history.forward();

    await waitFor(() => expect(onRestore).toHaveBeenCalledWith({ tab: "Users" }));
});

test("screenHistory.test.ts Test 5: recording the restored screen should not add another history entry", async () => {
    screenHistory.start({ tab: "Courses" });
    screenHistory.record({ tab: "Users" });
    await goBackAndExpectRestore({ tab: "Courses" });
    const lengthBefore = window.history.length;

    // AppState records again after re-rendering with the restored state.
    screenHistory.record({ tab: "Courses" });

    expect(window.history.length).toBe(lengthBefore);
});

test("screenHistory.test.ts Test 6: a new screen after going Back should replace the screens ahead of it", async () => {
    screenHistory.start({ tab: "Courses" });
    screenHistory.record({ tab: "Users" });
    screenHistory.record({ tab: "Teams" });
    await goBackAndExpectRestore({ tab: "Users" });

    screenHistory.record({ tab: "Settings" });
    await goBackAndExpectRestore({ tab: "Users" });

    onRestore.mockClear();
    window.history.forward();

    await waitFor(() => expect(onRestore).toHaveBeenCalledWith({ tab: "Settings" }));
});

test("screenHistory.test.ts Test 7: entries written by an earlier instance should be ignored", async () => {
    const earlier = makeScreenHistory();
    earlier.start({ tab: "Courses" });
    earlier.record({ tab: "Users" });
    earlier.stop();

    screenHistory.start({ tab: "Courses" });
    screenHistory.record({ tab: "Teams" });

    // Back to this instance's first entry is restored...
    await goBackAndExpectRestore({ tab: "Courses" });

    // ...but one more Back lands on the earlier instance's entry, which is not.
    onRestore.mockClear();
    const popped = new Promise((resolve) => window.addEventListener("popstate", resolve, { once: true }));
    window.history.back();
    await popped;

    expect(onRestore).not.toHaveBeenCalled();
});

test("screenHistory.test.ts Test 8: stop should stop restoring screens", async () => {
    screenHistory.start({ tab: "Courses" });
    screenHistory.record({ tab: "Users" });
    screenHistory.stop();

    const popped = new Promise((resolve) => window.addEventListener("popstate", resolve, { once: true }));
    window.history.back();
    await popped;

    expect(onRestore).not.toHaveBeenCalled();
});
