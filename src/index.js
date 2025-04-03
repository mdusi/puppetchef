/**
 * Puppeteer-based web automation script runner
 * 
 * This module provides functionality to execute web automation recipes using Puppeteer.
 * It takes a configuration object and a recipe object as input, then executes the specified
 * web automation tasks sequentially.
 * 
 * The module is designed to work with recipe files that define a series of tasks,
 * each containing operations to perform on web elements. It supports various element
 * selection strategies and common web interactions.
 * 
 * @module puppetchef
 * @requires puppeteer
 */

const puppeteer = require('puppeteer-extra')

const { stepReservedKeys } = require('./utils/recipe.js');


/**
 * Executes a web automation recipe using Puppeteer
 * 
 * This function orchestrates the execution of a web automation recipe by:
 * 1. Launching a Puppeteer browser instance with the provided configuration
 * 2. Navigating to the specified URL
 * 3. Executing each task in the recipe sequentially
 * 4. Handling errors and cleanup
 * 
 * @param {Object} conf - Configuration object for browser settings
 * @param {Object} [conf.browser] - Puppeteer browser launch options
 * @param {Object} recipe - Recipe object containing automation tasks
 * @param {string} recipe.url - The URL to navigate to
 * @param {string} recipe.name - The name of the recipe
 * @param {Array<Object>} recipe.tasks - Array of tasks to execute
 * @param {string} recipe.tasks[].name - Name of the task
 * @param {Array<Object>} recipe.tasks[].steps - Steps to perform in the task
 * @param {Object} recipe.tasks[].steps[].select - Element selector configuration
 * @param {Object} recipe.tasks[].steps[].action - Action to perform
 * @param {boolean} [recipe.tasks[].steps[].required=true] - Whether step is required
 * @param {boolean} [debug=false] - Whether to enable debug logging
 * @returns {Promise<void>}
 * @throws {Error} If recipe execution fails
 * 
 * @example
 * // Basic recipe example
 * const recipe = {
 *   url: "https://example.com",
 *   name: "Login Test",
 *   tasks: [{
 *     name: "Login",
 *     steps: [{
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
async function main(conf, recipe, verbose = false, plugins = null) {
  if (verbose) {
    console.log(`Config file: ${conf}`);
    console.log(`Following recipe: ${recipe}`);
  }

  // Initialize browser with provided configuration
  const browser = await puppeteer.launch({
      ...(conf || {}),
  })
  const page = await browser.newPage()

  let retcode = 0

  // Navigate to the target URL
  await page.goto(recipe.url, { waitUntil: 'networkidle0' });

  // Execute recipe tasks
  for (const task of recipe.tasks) {
    if (verbose)
      console.log(task.name);
    // Skip tasks with no steps
    if (!task.steps || task.steps.length === 0) {
      if (verbose)
        console.log('No steps to perform for this task.');
      continue;
    }
    
    // Execute each steps in the task
    for (const step of task.steps) {
      if (verbose)
        console.log(step);

      // Extract keys from the step object that are not in the reserved keys
      const nonReservedKeys = Object.keys(step).filter(key => !stepReservedKeys.includes(key));
      const plugin = nonReservedKeys[0];

      try {
        await plugins[plugin][step[plugin].command](page, step[plugin]);
      } catch (error) {
        if (step.ignore_errors == true) {
          console.log(`Ignoring error: ${error}`);
          continue;
        }
        console.log(`Error executing plugin ${plugin}: ${error}`);
        retcode = 255;
        break;
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
