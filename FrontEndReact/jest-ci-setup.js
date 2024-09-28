const oldSetTimeout = global.setTimeout;

global.setTimeout = function(callback, ms, ...args) {
	if (ms === 3000) ms = 10_000;
	
	return oldSetTimeout(callback, ms, ...args);
};




