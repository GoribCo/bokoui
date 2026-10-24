/**
 * Error codes every endpoint may answer with, and the HTTP status each goes with. The body is always
 * `{ success: false, message, code, field? }`; `field` names the invalid input for `VALIDATION`.
 */
export const errorCodes = {
  BAD_REQUEST: 400,
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  VALIDATION: 422,
  INTERNAL: 500,
  SAMPLE_API_DISABLED: 503,
} as const;

export type ErrorCode = keyof typeof errorCodes;
