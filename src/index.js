/**
 * Puppeteer-based web automation script runner
 * 
 * This module provides functionality to execute web automation recipes using Puppeteer.
 * It takes a configuration object and a recipe object as input, then executes the specified
 * web automation steps sequentially.
 * 
 * @module puppetchef
 */

const puppeteer = require('puppeteer');

const { action, select } = require('./utils/helper.js');

/**
 * Executes a web automation recipe using Puppeteer
 * 
 * @param {Object} conf - Configuration object for browser settings
 * @param {Object} recipe - Recipe object containing automation steps
 * @param {string} recipe.url - The URL to navigate to
 * @param {Array<Object>} recipe.steps - Array of steps to execute
 * @param {string} recipe.steps[].name - Name of the step
 * @param {Array<Object>} recipe.steps[].ops - Operations to perform in the step
 * @param {Object} recipe.steps[].ops[] - Individual operation object
 * @param {string} recipe.steps[].ops[].type - Type of selector
 * @param {string} recipe.steps[].ops[].element - Element selector
 * @param {string} recipe.steps[].ops[].action - Action to perform
 * @param {string} [recipe.steps[].ops[].value] - Value for the action (masked in logs)
 * @param {string} [recipe.steps[].ops[].arg] - Additional argument for selection
 * @param {boolean} [recipe.steps[].ops[].required] - Whether operation is required
 * @returns {Promise<void>}
 */
async function main(conf, recipe, debug = false) {
  if (debug) {
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
    if (debug)
      console.log(step.name);
    // Skip steps with no operations
    if (!step.ops || step.ops.length === 0) {
      if (debug)
        console.log('No operations to perform for this step.');
      continue;
    }
    
    // Execute each operation in the step
    for (const op of step.ops) {
      // Create a masked version of the operation for logging
      const maskedOp = {...op};
      if ('value' in op)
        maskedOp.value = '*'.repeat(8);
      if (debug)
        console.log(maskedOp);
      
      try {
        // Perform element selection and action
        const elem = await select(page, op.type, op.element, op.arg);
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
