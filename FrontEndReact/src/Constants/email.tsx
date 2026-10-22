/**
* Frontend constants related to emails.
*/

/** 
 * Loose sanity check, not an RFC 5322 validator: 
 * non-empty local part, a single "@", a domain with at 
 * least one ".", and no whitespace. The backend is the 
 * source of truth for accepted addresses. 
*/
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;