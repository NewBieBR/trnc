#!/usr/bin/env node
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk = require('chalk');
var clear = require('clear');
var figlet = require('figlet');
var path = require('path');
var commander_1 = __importDefault(require("commander"));
var lodash_1 = __importDefault(require("lodash"));
var yesno_1 = __importDefault(require("yesno"));
var shell = require('shelljs');
var fs = require('fs');
var homedir = require('os').homedir();
var CONFIG_DIR_PATH = homedir + "/.config/trnc";
var CONFIG_FILE_PATH = CONFIG_DIR_PATH + "/config.json";
function setConfig(newConfig) {
    return __awaiter(this, void 0, void 0, function () {
        var currentConfig, config;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentConfig = require(CONFIG_FILE_PATH) || {};
                    config = __assign(__assign({}, currentConfig), newConfig);
                    return [4 /*yield*/, fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(config))];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
var TypescriptReactNativeStarterGit = 'git@github.com:NewBieBR/typescript-react-native-starter.git';
clear();
console.log(chalk.green(figlet.textSync('TRNC', { horizontalLayout: 'full' })));
commander_1.default
    .version(require('../package.json').version)
    .option('-d, --debug', 'output extra debugging');
commander_1.default
    .command('config')
    .description('Open configuration file')
    .action(function () {
    shell.exec("open " + CONFIG_FILE_PATH);
});
commander_1.default
    .command('init <ProjectName>')
    .option('-t, --template <templateName>', 'Use a custom template')
    .description('generates a new react native project with typescript')
    .action(function (projectName, cmdObj) { return __awaiter(void 0, void 0, void 0, function () {
    var ok, config, template, packageCmd, _i, _a, packageName, cmd, projectPathCmd;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!fs.existsSync(projectName)) return [3 /*break*/, 2];
                console.log(chalk.red("Directory '" + projectName + "' already exists."));
                return [4 /*yield*/, yesno_1.default({
                        question: 'Do you want to overwrite? [yes]',
                        defaultValue: true,
                    })];
            case 1:
                ok = _b.sent();
                if (!ok)
                    return [2 /*return*/];
                else
                    shell.exec('rm -rf ' + projectName);
                _b.label = 2;
            case 2:
                shell.exec('git clone ' + TypescriptReactNativeStarterGit + ' ' + projectName);
                shell.exec('cd ' + projectName + ' && yarn setup ' + projectName);
                return [4 /*yield*/, checkConfig()];
            case 3:
                _b.sent();
                config = getConfig();
                template = lodash_1.default.find(config.templates, function (t) { return t.name === (cmdObj.template || 'default'); });
                if (!template)
                    return [2 /*return*/];
                console.log(chalk.green("Using template'" + template.name + "'"));
                packageCmd = 'cd ' + projectName + ' && yarn add';
                for (_i = 0, _a = template.packages; _i < _a.length; _i++) {
                    packageName = _a[_i];
                    packageCmd += ' ' + packageName;
                }
                console.log('> ' + packageCmd);
                return [4 /*yield*/, shell.exec(packageCmd)];
            case 4:
                _b.sent();
                if (template.postInstall) {
                    cmd = 'cd ' + projectName + ' && ' + template.postInstall;
                    shell.exec(cmd);
                    console.log('> ' + cmd);
                }
                if (!(template.projectPath && template.projectPath.length > 0)) return [3 /*break*/, 6];
                projectPathCmd = "cp -R " + template.projectPath + "/* " + projectName + "/";
                console.log('> ' + projectPathCmd);
                return [4 /*yield*/, shell.exec(projectPathCmd)];
            case 5:
                _b.sent();
                _b.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); });
var DefaultConfig = {
    templates: {
        default: {
            name: 'default',
            packages: [],
            postInstall: '',
        },
    },
};
function checkConfig() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (fs.existsSync(CONFIG_FILE_PATH)) {
                        return [2 /*return*/];
                    }
                    console.log('hereazeaze');
                    return [4 /*yield*/, shell.exec("mkdir -p " + CONFIG_DIR_PATH + " && echo '{}' > " + CONFIG_FILE_PATH)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, setConfig(DefaultConfig)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getConfig() {
    return require(CONFIG_FILE_PATH);
}
commander_1.default
    .command('template')
    .option('-a, --add <templateName>', 'Add new template')
    .option('-i, --info <templateName>', 'Show template infomrations')
    .option('-l, --list', 'List all templates')
    .option('-p, --project <templateName> <projectPath>', 'All files from the projectPath will be copied into the newly created project')
    .option('-s, --postInstall <templateName> <command>', "Set post template's post install command to be executed")
    .option('-p, --packages <templateName> <package> [otherPackages...]', "Add packges to template's")
    .parse(process.argv)
    .action(function (cmdObj) { return __awaiter(void 0, void 0, void 0, function () {
    var config, template, projectPath, template, template, newPackages, template;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, checkConfig()];
            case 1:
                _e.sent();
                config = getConfig();
                if (cmdObj.add) {
                    if (lodash_1.default.find(config.templates, function (t) { return t.name === cmdObj.add; }) !== undefined) {
                        console.log("Template '" + cmdObj.add + "' already exists.");
                        return [2 /*return*/];
                    }
                    setConfig({
                        templates: __assign(__assign({}, config.templates), (_a = {}, _a[cmdObj.add] = { name: cmdObj.add, packages: [] }, _a)),
                    });
                }
                else if (cmdObj.project) {
                    template = lodash_1.default.find(config.templates, function (t) { return t.name === cmdObj.project; });
                    projectPath = cmdObj.args[1] !== '' ? path.resolve(cmdObj.args[1]) : '';
                    if (template === undefined) {
                        console.log("Template '" + cmdObj.project + "' does not exists.");
                        return [2 /*return*/];
                    }
                    if (cmdObj.args[1] !== '' && !fs.existsSync(projectPath)) {
                        console.log(projectPath + ' does not exists');
                        return [2 /*return*/];
                    }
                    setConfig({
                        templates: __assign(__assign({}, config.templates), (_b = {}, _b[template.name] = __assign(__assign({}, template), { projectPath: projectPath }), _b)),
                    });
                }
                else if (cmdObj.postInstall) {
                    template = lodash_1.default.find(config.templates, function (t) { return t.name === cmdObj.postInstall; });
                    if (template === undefined) {
                        console.log("Template '" + cmdObj.postInstall + "' does not exists.");
                        return [2 /*return*/];
                    }
                    setConfig({
                        templates: __assign(__assign({}, config.templates), (_c = {}, _c[template.name] = __assign(__assign({}, template), { postInstall: cmdObj.args[1] }), _c)),
                    });
                }
                else if (cmdObj.packages) {
                    template = lodash_1.default.find(config.templates, function (t) { return t.name === cmdObj.packages; });
                    if (template === undefined) {
                        console.log("Template '" + cmdObj.packages + "' does not exists.");
                        return [2 /*return*/];
                    }
                    newPackages = __spreadArrays(cmdObj.args);
                    newPackages.shift();
                    setConfig({
                        templates: __assign(__assign({}, config.templates), (_d = {}, _d[template.name] = __assign(__assign({}, template), { packages: lodash_1.default.uniq(template.packages.concat(newPackages)) }), _d)),
                    });
                }
                else if (cmdObj.info) {
                    template = lodash_1.default.find(config.templates, function (t) { return t.name === cmdObj.info; });
                    if (template === undefined) {
                        console.log("Template '" + cmdObj.info + "' does not exist.");
                        return [2 /*return*/];
                    }
                    console.log(template);
                }
                else if (cmdObj.list) {
                    console.log('Templates:', Object.keys(config.templates));
                }
                else {
                    cmdObj.outputHelp();
                }
                return [2 /*return*/];
        }
    });
}); });
commander_1.default.parse(process.argv);
if (commander_1.default.debug)
    console.log(commander_1.default.opts());
if (!process.argv.slice(2).length) {
    commander_1.default.outputHelp();
}
