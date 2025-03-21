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
const path = require('path');
const yaml = require('js-yaml');
const { main } = require('./src/index.js');
const { parseRecipeWithSchema } = require('./src/utils/recipe.js');
const program = new Command();

/**
 * Command line interface configuration
 * 
 * Available options:
 * - -c, --conf <file>    : Configuration file path (default: puppetchefrc)
 * - -v, --verbose       : Enable verbose logging (default: false)
 * - <recipe>            : Recipe file path in YAML format (required)
 */
program
  .name('puppetchef')
  .version('2.0.0')
  .description('Puppetchef CLI')
  .option('-c, --conf <file>', 'config file', 'puppetchefrc')
  .option('-v, --verbose', 'enable verbose logging', false)
  .option('--syntax-check', 'validate recipe only', false)
  .option('-e, --extra <file>', 'plugins file')
  .argument('<recipe>', 'recipe file (yaml format)')
  .parse(process.argv);

const options = program.opts();
const [recipeFile] = program.args;

const verbose = options.verbose;
const configFile = options.conf;
const pluginsFile = options.extra;
const syntaxCheck = options.syntaxCheck;
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
 * // Returns: { url: "https://example.com", tasks: [...] }
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
const recipe = parseRecipeWithSchema(parseYamlFile(recipeFile), verbose);

// Import plugins from the specified file
const plugins = pluginsFile ? require(path.resolve(process.cwd(), pluginsFile)) : null;

if (syntaxCheck)
  process.exit(0);

// Execute the recipe
main(config, recipe, verbose, plugins);