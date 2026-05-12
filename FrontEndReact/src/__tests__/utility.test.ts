import { test, expect } from "@jest/globals";
import { getDueDateString } from "../utility";
test("utility.test.ts Test 1: Verify getDueDateString output is correct", () => {
	// getDueDateString must return a valid UTC ISO 8601 string matching toISOString().
	// Expected values are computed from the same Date to stay timezone-agnostic.
	const d1 = new Date(2024, 7, 12, 6, 32, 10, 354);
	expect(getDueDateString(d1)).toBe(d1.toISOString());

	const d2 = new Date(2001, 0, 1, 0, 0, 1, 999);
	expect(getDueDateString(d2)).toBe(d2.toISOString());

	const d3 = new Date(100, 11, 30, 23, 59, 59, 0);
	expect(getDueDateString(d3)).toBe(d3.toISOString());

	// Test all days in a month
	for (let d = 1; d <= 31; d++) {
		const date = new Date(2024, 7, d, 2, 0, 0, 999);
		expect(getDueDateString(date)).toBe(date.toISOString());
	}
});
