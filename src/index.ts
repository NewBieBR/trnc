#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
const program = require('commander');

clear();
console.log(chalk.red(figlet.textSync('TRNC', { horizontalLayout: 'full' })));

program
  .version('0.0.1')
  .option('-d, --debug', 'output extra debugging');

program.parse(process.argv);

if (program.debug) console.log(program.opts());
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
