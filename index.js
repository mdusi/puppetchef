#!/usr/bin/env node

const { Command } = require('commander');
const { main } = require('./src/index.js');

const program = new Command();

program
  .name('puppetchef')
  .version('1.0.0')
  .description('Puppetchef CLI')
  .option('-c, --conf <file>', 'conf file', 'puppetchefrc')
  .requiredOption('-i, --recipe <file>', 'recipe file (yaml format)')
  .parse(process.argv);

const options = program.opts();

const config = options.conf;
const recipe = options.recipe;

main(config, recipe);