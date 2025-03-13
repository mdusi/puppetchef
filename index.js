#!/usr/bin/env node

/**
 * Puppetchef CLI - Command Line Interface
 * 
 * This is the main entry point for the Puppetchef web automation tool.
 * It provides a command-line interface for executing web automation recipes
 * defined in YAML format with configuration from a JSON file.
 * 
 * @module puppetchef-cli
 * @requires commander
 * @requires js-yaml
 */

const { Command } = require('commander');
const fs = require('fs');
const yaml = require('js-yaml');
const { main } = require('./src/index.js');
const { parseRecipeWithSchema } = require('./src/utils/recipe.js');
const program = new Command();

/**
 * Command line interface configuration
 * 
 * Available options:
 * - -c, --conf <file>    : Configuration file path (default: puppetchefrc)
 * - -d, --debug         : Enable debug logging (default: false)
 * - -i, --recipe <file> : Recipe file path in YAML format (required)
 */
program
  .name('puppetchef')
  .version('1.0.0')
  .description('Puppetchef CLI')
  .option('-c, --conf <file>', 'config file', 'puppetchefrc')
  .option('-d, --debug', 'enable debug logging', false)
  .requiredOption('-i, --recipe <file>', 'recipe file (yaml format)')
  .parse(process.argv);

const options = program.opts();

const debug = options.debug;
const configFile = options.conf;
const recipeFile = options.recipe;

/**
 * Parses a JSON configuration file
 * 
 * @param {string} filePath - Path to the JSON configuration file
 * @returns {Object} The parsed configuration object
 * @throws {Error} If the file cannot be read or parsed
 * 
 * @example
 * const config = parseJsonFile('puppetchefrc');
 * // Returns: { browser: { headless: false } }
 */
function parseJsonFile(filePath) {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (e) {
    console.error(`Error reading or parsing JSON file: ${e.message}`);
    process.exit(1);
  }
}

/**
 * Parses a YAML recipe file
 * 
 * @param {string} filePath - Path to the YAML recipe file
 * @returns {Object} The parsed recipe object
 * @throws {Error} If the file cannot be read or parsed
 * 
 * @example
 * const recipe = parseYamlFile('login.yaml');
 * // Returns: { url: "https://example.com", steps: [...] }
 */
function parseYamlFile(filePath) {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return yaml.load(fileContents);
  } catch (e) {
    console.error(`Error reading or parsing YAML file: ${e.message}`);
    process.exit(1);
  }
}

// Parse configuration and recipe files
const config = parseJsonFile(configFile);
const recipe = parseRecipeWithSchema(parseYamlFile(recipeFile), debug);

// Execute the recipe
main(config, recipe, debug);