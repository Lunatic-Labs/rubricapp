/*

This file holds an enum that describes the current state of a api request.

*/

/**
 * Represents a small subset of the states an API call can be in.
 */
export const REQUEST_STATE = {
    IDLE:    "IDLE",
    LOADING: "LOADING",
    SUCCESS: "SUCCESS",
    ERROR:   "ERROR",
} as const;

/*
    A request state type to enforce strict typing if needed.
*/
export type RequestState = typeof REQUEST_STATE[keyof typeof REQUEST_STATE];