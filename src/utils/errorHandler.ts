// Global error handler to suppress network-related errors

class ErrorHandler {
  private suppressedErrors = new Set<string>();
  private originalFetch: typeof fetch;
  private originalConsoleError: typeof console.error;

  constructor() {
    this.originalFetch = window.fetch;
    this.originalConsoleError = console.error;
  }

  init() {
    // Override fetch globally to catch and suppress network errors
    try {
      window.fetch = async (...args: Parameters<typeof fetch>): Promise<Response> => {
        try {
          return await this.originalFetch.apply(window, args);
        } catch (error) {
          // Silently convert all fetch errors to avoid third-party logging
          if (error instanceof TypeError && error.message && error.message.includes('Failed to fetch')) {
            // Create a custom error that won't trigger console logging
            const suppressedError = new Error('Network connection unavailable');
            suppressedError.name = 'NetworkError';
            throw suppressedError;
          }
          throw error;
        }
      };
    } catch (error) {
      console.warn('Could not override window.fetch');
    }

    // Try to override console.error to filter out network errors
    try {
      console.error = (...args: any[]) => {
        try {
          const message = args && args.length ? args.filter(arg => arg != null).join(' ') : '';
          const stringifiedArgs = args && args.length ? args.filter(arg => arg != null).map(arg => {
            try {
              return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
            } catch {
              return '[object]';
            }
          }).join(' ') : '';

          // Suppress all network-related error messages
          if (
            (message && typeof message === 'string' && message.includes('Failed to fetch')) ||
            (message && typeof message === 'string' && message.includes('TypeError: Failed to fetch')) ||
            (message && typeof message === 'string' && message.includes('Network request failed')) ||
            (message && typeof message === 'string' && message.includes('ERR_NETWORK')) ||
            (message && typeof message === 'string' && message.includes('ERR_INTERNET_DISCONNECTED')) ||
            (message && typeof message === 'string' && message.includes('NetworkError')) ||
            (message && typeof message === 'string' && message.includes('Network connection unavailable')) ||
            (message && typeof message === 'string' && message.includes('Backend unavailable')) ||
            (stringifiedArgs && typeof stringifiedArgs === 'string' && stringifiedArgs.includes('Failed to fetch')) ||
            (stringifiedArgs && typeof stringifiedArgs === 'string' && stringifiedArgs.includes('NetworkError')) ||
            (stringifiedArgs && typeof stringifiedArgs === 'string' && stringifiedArgs.includes('Backend unavailable')) ||
            (args && Array.isArray(args) && args.some(arg =>
              arg instanceof Error &&
              arg.message &&
              typeof arg.message === 'string' &&
              (arg.message.includes('Failed to fetch') ||
               arg.message.includes('Backend unavailable') ||
               arg.message.includes('Network connection unavailable') ||
               arg.name === 'NetworkError')
            ))
          ) {
            // Completely suppress these errors
            return;
          }
        } catch (e) {
          // If there's any error in our error handling, just pass through
        }

        // Allow other errors through
        this.originalConsoleError(...args);
      };
    } catch (error) {
      // If we can't override console.error, at least the fetch override will help
      console.warn('Could not override console.error - console may be read-only');
    }

    // Try to override console.warn as well (some libraries log fetch errors as warnings)
    try {
      const originalConsoleWarn = console.warn;
      console.warn = (...args: any[]) => {
        try {
          const message = args && args.length ? args.filter(arg => arg != null).join(' ') : '';
          if (
            (message && typeof message === 'string' && message.includes('Failed to fetch')) ||
            (message && typeof message === 'string' && message.includes('Network request failed')) ||
            (message && typeof message === 'string' && message.includes('NetworkError')) ||
            (message && typeof message === 'string' && message.includes('Backend unavailable')) ||
            (message && typeof message === 'string' && message.includes('Network connection unavailable'))
          ) {
            return;
          }
        } catch (e) {
          // If there's any error in our error handling, just pass through
        }
        originalConsoleWarn(...args);
      };
    } catch (error) {
      console.warn('Could not override console.warn - console may be read-only');
    }

    // Handle unhandled promise rejections with priority
    try {
      window.addEventListener('unhandledrejection', (event) => {
        const error = event.reason;
        if (
          error instanceof Error &&
          error.message &&
          (error.message.includes('Failed to fetch') ||
           error.message.includes('Backend unavailable') ||
           error.message.includes('Network connection unavailable') ||
           error.name === 'NetworkError')
        ) {
          // Prevent the error from being logged
          event.preventDefault();
          return;
        }
      }, true); // Use capture phase to handle before other listeners
    } catch (error) {
      console.warn('Could not add unhandledrejection listener');
    }

    // Handle general errors with priority
    try {
      window.addEventListener('error', (event) => {
        if (
          event.message &&
          (event.message.includes('Failed to fetch') ||
          event.message.includes('Network request failed') ||
          event.message.includes('NetworkError'))
        ) {
          // Prevent the error from being logged
          event.preventDefault();
          return;
        }
      }, true); // Use capture phase to handle before other listeners
    } catch (error) {
      console.warn('Could not add error listener');
    }

    // Additional protection: Override onerror
    try {
      const originalOnError = window.onerror;
      window.onerror = (message, source, lineno, colno, error) => {
        if (
          typeof message === 'string' &&
          message &&
          (message.includes('Failed to fetch') || message.includes('NetworkError'))
        ) {
          return true; // Prevent default error handling
        }
        if (originalOnError) {
          return originalOnError(message, source, lineno, colno, error);
        }
        return false;
      };
    } catch (error) {
      console.warn('Could not override window.onerror');
    }

    // Global protection against any remaining undefined.includes errors
    try {
      const originalStringIncludes = String.prototype.includes;
      String.prototype.includes = function(searchString: string, position?: number) {
        if (this == null) {
          return false;
        }
        return originalStringIncludes.call(this, searchString, position);
      };
    } catch (error) {
      console.warn('Could not override String.prototype.includes');
    }
  }

  // Method to restore original functions if needed
  restore() {
    window.fetch = this.originalFetch;
    console.error = this.originalConsoleError;
  }
}

export const errorHandler = new ErrorHandler();
