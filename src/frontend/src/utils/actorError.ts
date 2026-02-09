/**
 * Utility to parse and normalize errors from actor calls for user-friendly display and debugging.
 */

export interface ParsedActorError {
  userMessage: string;
  consoleDetails: {
    originalError: unknown;
    errorType: string;
    message: string;
    rejectMessage?: string;
  };
}

/**
 * Parse an unknown error from an actor call into a user-friendly message and structured console details.
 * Does not expose secrets or sensitive information.
 */
export function parseActorError(error: unknown, context: string = 'Operation'): ParsedActorError {
  let userMessage = `${context} failed`;
  let errorType = 'unknown';
  let message = 'An unknown error occurred';
  let rejectMessage: string | undefined;

  if (error instanceof Error) {
    errorType = error.name || 'Error';
    message = error.message;

    // Check for common canister rejection patterns
    if (message.includes('Unauthorized')) {
      userMessage = 'You are not authorized to perform this action';
      rejectMessage = message;
    } else if (message.includes('Actor not available')) {
      userMessage = 'Please wait for the connection to be ready';
      rejectMessage = message;
    } else if (message.includes('trap')) {
      // Extract trap message if present
      const trapMatch = message.match(/trap[:\s]+(.+)/i);
      if (trapMatch) {
        rejectMessage = trapMatch[1];
        userMessage = `${context} failed: ${trapMatch[1]}`;
      } else {
        rejectMessage = message;
      }
    } else if (message.includes('reject')) {
      rejectMessage = message;
      userMessage = `${context} failed: ${message}`;
    } else {
      // Generic error with message
      rejectMessage = message;
      if (message.length < 100) {
        userMessage = `${context} failed: ${message}`;
      }
    }
  } else if (typeof error === 'string') {
    errorType = 'string';
    message = error;
    rejectMessage = error;
    if (error.length < 100) {
      userMessage = `${context} failed: ${error}`;
    }
  } else if (error && typeof error === 'object') {
    errorType = 'object';
    message = JSON.stringify(error);
    rejectMessage = message;
  }

  return {
    userMessage,
    consoleDetails: {
      originalError: error,
      errorType,
      message,
      rejectMessage,
    },
  };
}
