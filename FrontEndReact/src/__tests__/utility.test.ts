import { getDueDateString } from "../utility.js";

// @ts-expect-error TS(2593): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("utility.test.js Test 1: Verify getDueDateString output is correct", () => {
	// Test some dates
// @ts-expect-error TS(2304): Cannot find name 'expect'.
	expect(getDueDateString(new Date(2024, 7, 12, 6, 32, 10, 354))).toBe("2024-8-12T6:32:10.354Z");
	
// @ts-expect-error TS(2304): Cannot find name 'expect'.
	expect(getDueDateString(new Date(2001, 0, 1, 0, 0, 1, 999))).toBe("2001-1-1T0:0:1.999Z");
	
// @ts-expect-error TS(2304): Cannot find name 'expect'.
	expect(getDueDateString(new Date(100, 11, 30, 23, 59, 59, 0))).toBe("100-12-30T23:59:59.0Z");
	
	// Test all days in a month
	for (let d = 1; d <= 31; d++) {
// @ts-expect-error TS(2304): Cannot find name 'expect'.
		expect(getDueDateString(new Date(2024, 7, d, 2, 0, 0, 999))).toBe(`2024-8-${d}T2:0:0.999Z`);
	}
});
