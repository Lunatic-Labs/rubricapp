/*

This file holds an enum that describes the current state of a api request.

*/

/**
 * Represents a small subset of the states an API call can be in.
 */
export const RequestState = Object.freeze({
    IDLE:    "IDLE",
    LOADING: "LOADING",
    SUCCESS: "SUCCESS",
    ERROR:   "ERROR",
})