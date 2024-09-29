/*
	This is a bandaid fix to get Jest tests to work on CI and
	should be removed as soon as SKIL-470 is resolved.

	Summary of the issue:
	There are a lot of places in the Jest tests where a pattern like this is used:
		await waitFor(() => {
			setTimeout(() => {
				// expect some things
			}, 3000);
		});
	Due to the way that setTimeout works, Jest does not wait for the
	timeout to complete before finishing the test. This means that any code
	inside of these setTimeout blocks is effectively disabled as long as the
	test takes less than 3 seconds to complete. So as the codebase has drifted,
	many of the expects in these setTimeout blocks have become broken or
	incorrect, but Jest never runs thems them, so they have gone undetected.
	
	However, the GitHub actions runners are much slower than most personal
	computers, so in the CI it's possible for some tests to take longer than 3
	seconds to complete which allows the broken code to be run. These tests need
	to be properly fixed, but that would be monumental task so in the interest of
	getting the CI working in a reasonable amount of time, this hack will force
	the setTimeout blocks to delay for 60 seconds instead of 3 to compensate
	for the slower CPUs on GitHub actions.
*/

const oldSetTimeout = global.setTimeout;

global.setTimeout = function(callback, ms, ...args) {
	// All of the setTimeout blocks I've seen in the tests use 3 seconds
	// as the delay so I'm specifically targeting that.
	if (ms === 3000) ms = 60_000;
	
	return oldSetTimeout(callback, ms, ...args);
};
