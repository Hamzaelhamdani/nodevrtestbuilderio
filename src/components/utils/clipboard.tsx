import * as React from 'react';
/**
 * Utility for clipboard operations with fallback methods
 */

/**
 * Copy text to clipboard with fallback mechanisms
 * @param text Text to copy to clipboard
 * @returns Promise that resolves when copying is successful
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Check if we have navigator.clipboard
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      // Silently handle clipboard API errors - no need to log them
      // We'll try fallback method next
    }
  }

  // Fallback for browsers without clipboard API or when it's blocked
  return new Promise((resolve) => {
    try {
      // Create temporary textarea element
      const textArea = document.createElement('textarea');
      textArea.value = text;
      
      // Make it invisible but functional
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.width = '2em';
      textArea.style.height = '2em';
      textArea.style.padding = '0';
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';
      textArea.style.background = 'transparent';
      textArea.style.opacity = '0';
      textArea.style.zIndex = '-1'; // Ensure it's below other elements
      
      document.body.appendChild(textArea);
      
      // Focus and select the text
      textArea.focus();
      textArea.select();
      
      // Try to copy using execCommand
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      resolve(successful);
    } catch (error) {
      // If everything fails, resolve with false but don't throw
      resolve(false);
    }
  });
}

/**
 * Select and copy text from a specific element
 * @param element The element containing text to copy
 * @returns Promise that resolves to true if successful
 */
export async function copyElementText(element: HTMLElement): Promise<boolean> {
  if (!element) return false;
  
  try {
    // Get the text from the element
    const text = element.textContent || '';
    return await copyToClipboard(text);
  } catch (error) {
    return false;
  }
}

/**
 * Check if the clipboard API is available and permitted in the current environment
 * @returns Boolean indicating if clipboard is available
 */
export function isClipboardAvailable(): boolean {
  return !!(navigator.clipboard && typeof navigator.clipboard.writeText === 'function');
}