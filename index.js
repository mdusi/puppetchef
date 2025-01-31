#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs');
const yaml = require('js-yaml');
const { main } = require('./src/index.js');

const program = new Command();

program
  .name('puppetchef')
  .version('1.0.0')
  .description('Puppetchef CLI')
  .option('-c, --conf <file>', 'config file', 'puppetchefrc')
  .requiredOption('-i, --recipe <file>', 'recipe file (yaml format)')
  .parse(process.argv);

const options = program.opts();

const configFile = options.conf;
const recipeFile = options.recipe;

// Function to parse YAML file
function parseYamlFile(filePath) {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return yaml.load(fileContents);
  } catch (e) {
    console.error(`Error reading or parsing YAML file: ${e.message}`);
    process.exit(1);
  }
}

// Function to parse JSON file
function parseJsonFile(filePath) {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (e) {
    console.error(`Error reading or parsing JSON file: ${e.message}`);
    process.exit(1);
  }
}

const config = parseJsonFile(configFile);
const recipe = parseYamlFile(recipeFile);

main(config, recipe);