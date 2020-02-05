#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
import program from 'commander';
const shell = require('shelljs');
const fs = require('fs');
import yesno from 'yesno';

const TypescriptReactNativeStarterGit =
  'git@github.com:NewBieBR/typescript-react-native-starter.git';

clear();
console.log(chalk.green(figlet.textSync('TRNC', { horizontalLayout: 'full' })));

program.version('0.0.1').option('-d, --debug', 'output extra debugging');

program
  .command('init [ProjectName]')
  .description('generates a new react native project with typescript')
  .action(async (projectName: string) => {
    if (fs.existsSync(projectName)) {
      console.log(chalk.red("Directory '" + projectName + "' already exists."));
      const ok = await yesno({
        question: 'Do you want to overwrite? [yes]',
        defaultValue: true,
      });
      if (!ok) return;
      else shell.exec('rm -rf ' + projectName);
    }
    shell.exec(
      'git clone ' + TypescriptReactNativeStarterGit + ' ' + projectName,
    );
    shell.exec('cd ' + projectName + ' && yarn setup ' + projectName);
  });

program.parse(process.argv);
if (program.debug) console.log(program.opts());

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
