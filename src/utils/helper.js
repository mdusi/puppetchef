/**
 * Helper functions for Puppeteer web automation
 * 
 * This module provides utility functions for element selection and action execution
 * in Puppeteer-based web automation. It supports various element selection strategies
 * and common web interactions.
 * 
 * The module is designed to work with Puppeteer's Page and ElementHandle objects,
 * providing a simplified interface for common web automation tasks.
 * 
 * @module helper
 * @requires puppeteer
 */

/**
 * Selects an element on the page using various strategies
 * 
 * This function provides different ways to select elements or wait for conditions:
 * - wait: Pauses execution for a specified time
 * - polling: Waits for an element to contain specific text
 * - element: Selects an element using a CSS selector
 * 
 * @param {import('puppeteer').Page} page - The Puppeteer page object
 * @param {string} elType - The type of selection strategy:
 *                          - 'wait': Wait for a specified time
 *                          - 'polling': Wait for text to appear in an element
 *                          - 'element': Select by CSS selector
 * @param {string} elValue - The value to use for selection:
 *                          - For 'wait': Time in milliseconds
 *                          - For 'polling': CSS selector to check
 *                          - For 'element': CSS selector to select
 * @param {string} [elArg] - Additional argument:
 *                          - For 'polling': Text to wait for in the element
 *                          - Not used for other types
 * @returns {Promise<import('puppeteer').ElementHandle|void>} The selected element or void for wait
 * @throws {Error} If the element type is not supported
 * 
 * @example
 * // Wait for 5 seconds
 * await select(page, 'wait', '5000');
 * 
 * // Wait for text to appear in an element
 * await select(page, 'polling', '#status', 'Ready');
 * 
 * // Select an element by CSS selector
 * const button = await select(page, 'element', '#submit');
 * 
 * // Complete example with error handling
 * try {
 *   const element = await select(page, 'element', '#non-existent');
 *   if (element) {
 *     await action(element, 'click');
 *   }
 * } catch (error) {
 *   console.error('Failed to select element:', error);
 * }
 */
async function select (page, elType, elValue, elArg) {
    switch (elType) {
        case 'wait': {
            const waitTime = parseInt(elValue, 10);
            return await new Promise(r => setTimeout(r, waitTime));
        }
        case 'polling': {
            // Listen for console messages from the browser
            page.on('console', msg => console.log('Browser log:', msg.text()));
            
            return await page.waitForFunction(
                (selector, text) => {
                    console.log(`Checking selector: ${selector} for text: ${text}`);
                    const element = document.querySelector(selector);
                    if (!element) {
                        console.log(`Element not found: ${selector}`);
                        return false;
                    }
                    const hasText = element.innerText.includes(text);
                    console.log(`Text "${text}" ${hasText ? 'found' : 'not found'} in element`);
                    return hasText;
                },
                { polling: 1000 },  // Poll every second for better logging visibility
                elValue,
                elArg
            );
        }
        case 'element':
          return await page.locator(elValue);
        default:
          throw new Error(`Unsupported element type: ${elType}`);
    }
}

/**
 * Performs an action on a selected element
 * 
 * This function executes common web interactions on a selected element:
 * - fill_out: Fills an input field with text
 * - click: Clicks a button or link
 * 
 * The function is designed to work with Puppeteer's ElementHandle objects
 * and provides a simplified interface for common web interactions.
 * 
 * @param {import('puppeteer').ElementHandle} elem - The element to perform the action on
 * @param {string} elAction - The type of action to perform:
 *                           - 'fill_out': Fill an input field
 *                           - 'click': Click the element
 * @param {string} [elValue] - The value to use for the action:
 *                            - For 'fill_out': Text to fill in the field
 *                            - Not used for other actions
 * @returns {Promise<void>}
 * @throws {Error} If the action fails (e.g., element not clickable)
 * 
 * @example
 * // Fill out a form field
 * await action(inputElement, 'fill_out', 'John Doe');
 * 
 * // Click a button
 * await action(buttonElement, 'click');
 * 
 * // Complete example with error handling
 * try {
 *   const element = await select(page, 'element', '#submit');
 *   await action(element, 'click');
 * } catch (error) {
 *   console.error('Failed to perform action:', error);
 * }
 */
async function action (elem, elAction, elValue) {
    switch (elAction) {
        case 'fill_out':
            await elem.fill(elValue);
            break;
        case 'click':
            await elem.click();
            break;
        default:
            break;
    }   
}

module.exports = { select, action };