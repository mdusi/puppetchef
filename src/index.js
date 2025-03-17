/**
 * Puppeteer-based web automation script runner
 * 
 * This module provides functionality to execute web automation recipes using Puppeteer.
 * It takes a configuration object and a recipe object as input, then executes the specified
 * web automation steps sequentially.
 * 
 * The module is designed to work with recipe files that define a series of steps,
 * each containing operations to perform on web elements. It supports various element
 * selection strategies and common web interactions.
 * 
 * @module puppetchef
 * @requires puppeteer
 */

const puppeteer = require('puppeteer');

const { action, select } = require('./utils/helper.js');

/**
 * Executes a web automation recipe using Puppeteer
 * 
 * This function orchestrates the execution of a web automation recipe by:
 * 1. Launching a Puppeteer browser instance with the provided configuration
 * 2. Navigating to the specified URL
 * 3. Executing each step in the recipe sequentially
 * 4. Handling errors and cleanup
 * 
 * @param {Object} conf - Configuration object for browser settings
 * @param {Object} [conf.browser] - Puppeteer browser launch options
 * @param {Object} recipe - Recipe object containing automation steps
 * @param {string} recipe.url - The URL to navigate to
 * @param {string} recipe.name - The name of the recipe
 * @param {Array<Object>} recipe.steps - Array of steps to execute
 * @param {string} recipe.steps[].name - Name of the step
 * @param {Array<Object>} recipe.steps[].ops - Operations to perform in the step
 * @param {Object} recipe.steps[].ops[].select - Element selector configuration
 * @param {Object} recipe.steps[].ops[].action - Action to perform
 * @param {boolean} [recipe.steps[].ops[].required=true] - Whether operation is required
 * @param {boolean} [debug=false] - Whether to enable debug logging
 * @returns {Promise<void>}
 * @throws {Error} If recipe execution fails
 * 
 * @example
 * // Basic recipe example
 * const recipe = {
 *   url: "https://example.com",
 *   name: "Login Test",
 *   steps: [{
 *     name: "Login",
 *     ops: [{
 *       select: "#username",
 *       action: { type: "fill_out", value: "testuser" }
 *     }, {
 *       select: "#password",
 *       action: { type: "fill_out", value: "password123" }
 *     }, {
 *       select: "#submit",
 *       action: "click"
 *     }]
 *   }]
 * };
 * 
 * // Configuration example
 * const conf = {
 *   browser: {
 *     headless: false,
 *     defaultViewport: { width: 1920, height: 1080 }
 *   }
 * };
 * 
 * // Execute the recipe
 * try {
 *   await main(conf, recipe, true);
 * } catch (error) {
 *   console.error('Recipe execution failed:', error);
 *   process.exit(1);
 * }
 */
async function main(conf, recipe, verbose = false) {
  if (verbose) {
    console.log(`Config file: ${conf}`);
    console.log(`Following recipe: ${recipe}`);
  }

  // Initialize browser with provided configuration
  const browser = await puppeteer.launch({
      ...(conf.browser || {}),
  })
  const page = await browser.newPage()

  // Configure viewport for consistent rendering
  await page.setViewport({ width: 1920, height: 1080 });

  let retcode = 0

  // Navigate to the target URL
  await page.goto(recipe.url, { waitUntil: 'networkidle0' });

  // Execute recipe steps
  for (const step of recipe.steps) {
    if (verbose)
      console.log(step.name);
    // Skip steps with no operations
    if (!step.ops || step.ops.length === 0) {
      if (verbose)
        console.log('No operations to perform for this step.');
      continue;
    }
    
    // Execute each operation in the step
    for (const op of step.ops) {
      // Create a masked version of the operation for logging
      const maskedOp = {...op};
      if ('value' in op)
        maskedOp.value = '*'.repeat(8);
      if (verbose)
        console.log(maskedOp);
      
      try {
        // Perform element selection and action
        const elem = await select(page, op.select.type, op.select.element, op.select.value);
        await action(elem, op.action.type, op.action.value);
      } catch (error) {
        console.log(error);
        // If operation is required and fails, set error code and break
        if (!op.required || op.required == true) {
          retcode = 255;
          break;
        }
      }
    }

    if (retcode > 0)
      break;
  }

  // Cleanup and exit
  await browser.close()
  process.exit(retcode)
}

module.exports = { main };
