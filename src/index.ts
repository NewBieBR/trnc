#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
import program from 'commander';
import _ from 'lodash';
import yesno from 'yesno';
const shell = require('shelljs');
const fs = require('fs');
const homedir = require('os').homedir();

interface Template {
  name: string;
  packages: string[];
  postInstall: string;
  projectPath?: string;
}

interface Config {
  templates: Record<string, Template>;
}

const CONFIG_DIR_PATH = `${homedir}/.config/trnc`;
const CONFIG_FILE_PATH = `${CONFIG_DIR_PATH}/config.json`;

async function setConfig(newConfig: Partial<Config>) {
  const currentConfig = require(CONFIG_FILE_PATH) || {};
  const config = { ...currentConfig, ...newConfig };
  return await fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(config));
}

const TypescriptReactNativeStarterGit =
  'git@github.com:NewBieBR/typescript-react-native-starter.git';

clear();
console.log(chalk.green(figlet.textSync('TRNC', { horizontalLayout: 'full' })));

program
  .version(require('../package.json').version)
  .option('-d, --debug', 'output extra debugging');

program
  .command('config')
  .description('Open configuration file')
  .action(() => {
    shell.exec(`open ${CONFIG_FILE_PATH}`);
  });

program
  .command('init <ProjectName>')
  .option('-t, --template <templateName>', 'Use a custom template')
  .description('generates a new react native project with typescript')
  .action(async (projectName: string, cmdObj) => {
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
    await checkConfig();
    const config = getConfig();
    const template = _.find(
      config.templates,
      t => t.name === (cmdObj.template || 'default'),
    );
    if (!template) return;
    console.log(chalk.green("Using template'" + template.name + "'"));
    let packageCmd = 'cd ' + projectName + ' && yarn add';
    for (const packageName of template.packages) {
      packageCmd += ' ' + packageName;
    }
    console.log('> ' + packageCmd);
    await shell.exec(packageCmd);
    if (template.postInstall) {
      const cmd = 'cd ' + projectName + ' && ' + template.postInstall;
      shell.exec(cmd);
      console.log('> ' + cmd);
    }
    if (template.projectPath && template.projectPath.length > 0) {
      const projectPathCmd = `cp -R ${template.projectPath}/* ${projectName}/`;
      console.log('> ' + projectPathCmd);
      await shell.exec(projectPathCmd);
    }
  });

const DefaultConfig: Partial<Config> = {
  templates: {
    default: {
      name: 'default',
      packages: [],
      postInstall: '',
    },
  },
};

async function checkConfig() {
  if (fs.existsSync(CONFIG_FILE_PATH)) {
    return;
  }
  console.log('hereazeaze');
  await shell.exec(
    `mkdir -p ${CONFIG_DIR_PATH} && echo '{}' > ${CONFIG_FILE_PATH}`,
  );
  await setConfig(DefaultConfig);
}

function getConfig(): Config {
  return require(CONFIG_FILE_PATH);
}
program
  .command('template')
  .option('-a, --add <templateName>', 'Add new template')
  .option('-i, --info <templateName>', 'Show template infomrations')
  .option('-l, --list', 'List all templates')
  .option(
    '-p, --project <templateName> <projectPath>',
    'All files from the projectPath will be copied into the newly created project',
  )
  .option(
    '-s, --postInstall <templateName> <command>',
    "Set post template's post install command to be executed",
  )
  .option(
    '-p, --packages <templateName> <package> [otherPackages...]',
    "Add packges to template's",
  )
  .parse(process.argv)
  .action(async cmdObj => {
    await checkConfig();
    const config = getConfig();
    if (cmdObj.add) {
      if (_.find(config.templates, t => t.name === cmdObj.add) !== undefined) {
        console.log("Template '" + cmdObj.add + "' already exists.");
        return;
      }
      setConfig({
        templates: {
          ...config.templates,
          [cmdObj.add]: { name: cmdObj.add, packages: [] },
        },
      });
    } else if (cmdObj.project) {
      const template = _.find(config.templates, t => t.name === cmdObj.project);
      if (template === undefined) {
        console.log("Template '" + cmdObj.project + "' does not exists.");
        return;
      }
      const projectPath =
        cmdObj.args[1] !== '' ? path.resolve(cmdObj.args[1]) : '';
      if (cmdObj.args[1] !== '' && !fs.existsSync(projectPath)) {
        console.log(cmdObj.args[1] + ' does not exists');
        return;
      }
      if (cmdObj.args[1] !== '' && fs.statSync(projectPath).isFile()) {
        console.log(cmdObj.args[1] + ' is not a directory');
        return;
      }
      setConfig({
        templates: {
          ...config.templates,
          [template.name]: { ...template, projectPath },
        },
      });
    } else if (cmdObj.postInstall) {
      const template = _.find(
        config.templates,
        t => t.name === cmdObj.postInstall,
      );
      if (template === undefined) {
        console.log("Template '" + cmdObj.postInstall + "' does not exists.");
        return;
      }
      setConfig({
        templates: {
          ...config.templates,
          [template.name]: { ...template, postInstall: cmdObj.args[1] },
        },
      });
    } else if (cmdObj.packages) {
      const template = _.find(
        config.templates,
        t => t.name === cmdObj.packages,
      );
      if (template === undefined) {
        console.log("Template '" + cmdObj.packages + "' does not exists.");
        return;
      }
      const newPackages = [...cmdObj.args];
      newPackages.shift();
      setConfig({
        templates: {
          ...config.templates,
          [template.name]: {
            ...template,
            packages: _.uniq(template.packages.concat(newPackages)),
          },
        },
      });
    } else if (cmdObj.info) {
      const template = _.find(config.templates, t => t.name === cmdObj.info);
      if (template === undefined) {
        console.log("Template '" + cmdObj.info + "' does not exist.");
        return;
      }
      console.log(template);
    } else if (cmdObj.list) {
      console.log('Templates:', Object.keys(config.templates));
    } else {
      cmdObj.outputHelp();
    }
  });

program.parse(process.argv);
if (program.debug) console.log(program.opts());

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
