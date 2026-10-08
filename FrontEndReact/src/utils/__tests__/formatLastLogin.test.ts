import { test, expect } from "@jest/globals";
import { formatLastLogin } from "../formatLastLogin";

// Intl output uses narrow no-break spaces in some ICU versions; compare on plain spaces.
const normalize = (text: string) => text.replace(/\s/g, " ");

test("formatLastLogin.test.ts Test 1: shows Never when the user has not logged in", () => {
    expect(formatLastLogin(null, false)).toBe("Never");
    expect(formatLastLogin(undefined, true)).toBe("Never");
    expect(formatLastLogin("", true)).toBe("Never");
});

test("formatLastLogin.test.ts Test 2: formats in UTC when showUtc is true", () => {
    expect(normalize(formatLastLogin("2026-09-08T14:05:00Z", true, "en-US"))).toBe("Sep 8, 2026, 2:05 PM UTC");
});

test("formatLastLogin.test.ts Test 3: reads a timestamp without an offset as UTC", () => {
    expect(formatLastLogin("2026-09-08T14:05:00", true, "en-US"))
        .toBe(formatLastLogin("2026-09-08T14:05:00Z", true, "en-US"));
    expect(formatLastLogin("2026-09-08T14:05:00.123456", true, "en-US"))
        .toBe(formatLastLogin("2026-09-08T14:05:00Z", true, "en-US"));
});

test("formatLastLogin.test.ts Test 4: respects an explicit offset", () => {
    expect(normalize(formatLastLogin("2026-09-08T09:05:00-05:00", true, "en-US"))).toBe("Sep 8, 2026, 2:05 PM UTC");
});

test("formatLastLogin.test.ts Test 5: local time matches the viewer's time zone", () => {
    const expected = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
    }).format(new Date("2026-09-08T14:05:00Z"));

    expect(formatLastLogin("2026-09-08T14:05:00", false, "en-US")).toBe(expected);
});

test("formatLastLogin.test.ts Test 6: returns Unknown for an unparseable value", () => {
    expect(formatLastLogin("not a date", true)).toBe("Unknown");
});
