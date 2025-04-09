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
const { stepReservedKeys } = require('./recipe.js');
const { logger } = require('./logger.js');

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
 * @returns {Promise<void>}
 * @throws {Error} If recipe execution fails
 */
async function main(conf, recipe, plugins = null) {
  // Initialize browser with provided configuration
  const browser = await puppeteer.launch({
      ...(conf || {}),
  })
  const page = await browser.newPage()

  let retcode = 0

  // Navigate to the target URL
  await page.goto(recipe.url, { waitUntil: 'networkidle0' });

  let variables = {};
  const regex = /(?<!\S)(\w+)/g;
  const fn = (match) => match in variables ? `variables['${match}']` : match;
  const regex2 = /{{\s*(\w+.*?)\s*}}/g;
  const processEntry = (value) => regex2.test(value) ? eval(value.replace(regex2, `variables.$1`)) : value;

  // Execute recipe tasks
  for (const task of recipe.tasks) {
    logger.debug(`Executing task: ${task.name}`);
    // Skip tasks with no steps
    if (!task.steps || task.steps.length === 0) {
      logger.debug('No steps to perform for this task.');
      continue;
    }
    
    // Execute each steps in the task
    for (const step of task.steps) {
      logger.debug(JSON.stringify(step, null, 2));

      // Extract keys from the step object that are not in the reserved keys
      const nonReservedKeys = Object.keys(step).filter(key => !stepReservedKeys.includes(key));
      const plugin = nonReservedKeys[0];

      try {
        if (step.when) {
          const cond = step.when.replace(regex, fn);
          const isConditionTrue = eval(cond);
          if (!isConditionTrue) {
            logger.debug(`Condition not met: ${cond}`);
            continue;
          }
        }

        const data = Object.fromEntries(
          Object.entries(step[plugin]).map(([k, v]) => [k, processEntry(v)])
        );

        const ret = await plugins[plugin][step[plugin].command](page, data);

        if (step.register) {
          logger.debug(`Registering variable ${step.register} with value ${JSON.stringify(ret)}`);
          variables[step.register] = ret;
        };

      } catch (error) {
        if (step.ignore_errors == true) {
          logger.debug(`Ignoring error: ${error}`);
          continue;
        }
        logger.debug(`Error executing plugin ${plugin}: ${error}`);
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
