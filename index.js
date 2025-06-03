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

const { Command } = require("commander");
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { main } = require("./src/index.js");
const { parseRecipeWithSchema, stepReservedKeys } = require("./src/recipe.js");
const program = new Command();

/**
 * Command line interface configuration
 * 
 * Arguments:
 *   recipe             recipe file (yaml format)

 * Options:
 *   -V, --version      output the version number
 *   -c, --conf <file>  config file (default: "puppetchefrc")
 *   --syntax-check     validate recipe only (default: false)
 *   -h, --help         display help for command
 *
 */
program
  .name("puppetchef")
  .version("4.0.2")
  .description("Puppetchef CLI")
  .option("-c, --conf <file>", "config file", "puppetchefrc")
  .option("--syntax-check", "validate recipe only", false)
  .argument("<recipe>", "recipe file (yaml format)")
  .parse(process.argv);

const options = program.opts();
const [recipeFile] = program.args;

const configFile = options.conf;
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
    const fileContents = fs.readFileSync(filePath, "utf8");
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
    const fileContents = fs.readFileSync(filePath, "utf8");
    return yaml.load(fileContents);
  } catch (e) {
    console.error(`Error reading or parsing YAML file: ${e.message}`);
    process.exit(1);
  }
}

// Parse configuration and recipe files
const config = parseJsonFile(configFile);
const recipe = parseRecipeWithSchema(parseYamlFile(recipeFile));

const allSteps = recipe.tasks.flatMap((task) => task.steps.flat());
const pluginNames = [
  ...new Set(
    allSteps
      .map((s) =>
        Object.keys(s).filter((key) => !stepReservedKeys.includes(key)),
      )
      .flat(),
  ),
];

// Create a JSON object from an array of plugin names
const plugins = pluginNames.reduce((obj, plugin) => {
  const pluginPath = plugin.startsWith("puppetchef")
    ? plugin.split(".").slice(1)
    : null;
  if (pluginPath) {
    const basePath = plugin.startsWith("puppetchef.builtin") ? __dirname : "";
    obj[plugin] = require(path.join(basePath, ...pluginPath));
  }
  return obj;
}, {});

(async () => {
  // Execute the recipe
  if (!syntaxCheck) {
    await main(config, recipe, plugins).then((retcode) => {
      process.exit(retcode);
    });
  }
})();
