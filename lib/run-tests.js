'use strict';

const runCLI = require('jest').runCLI;
const BbPromise = require('bluebird');
const { setEnv } = require('./utils');
const commandLineArgs = require('command-line-args')

const optionDefinitions = [
  { name: 'bail' },
  { name: 'cache' },
  { name: 'collectCoverageFrom' },
  { name: 'colors' },
  { name: 'config' },
  { name: 'coverage' },
  { name: 'debug' },
  { name: 'env' },
  { name: 'expand' },
  { name: 'findRelatedTests' },
  { name: 'forceExit' },
  { name: 'help' },
  { name: 'json' },
  { name: 'outputFile' },
  { name: 'lastCommit' },
  { name: 'logHeapUsage' },
  { name: 'maxWorkers' },
  { name: 'noStackTrace' },
  { name: 'notify' },
  { name: 'onlyChanged' },
  { name: 'runInBand' },
  { name: 'setupTestFrameworkScriptFile' },
  { name: 'showConfig' },
  { name: 'silent' },
  { name: 'testNamePattern' },
  { name: 'testPathPattern' },
  { name: 'testRunner' },
  { name: 'updateSnapshot' },
  { name: 'useStderr' },
  { name: 'verbose' },
  { name: 'version' },
  { name: 'watch' },
  { name: 'watchAll' },
  { name: 'watchman' },
]

const runTests = (serverless, options) => new BbPromise((resolve, reject) => {
  const functionName = options.function;
  const allFunctions = serverless.service.getAllFunctions();
  const jestCliOptions = commandLineArgs(optionDefinitions, { argv: options['jest-cli-options'] })
console.log(jestCliOptions)
  const config = {
    testEnvironment: 'node',
  };

  const vars = new serverless.classes.Variables(serverless);
  vars.populateService(options);
  allFunctions.forEach(name => setEnv(serverless, name));

  if (functionName) {
    if (allFunctions.indexOf(functionName) >= 0) {
      setEnv(serverless, functionName);
      Object.assign(config, { testRegex: `${functionName}\\.test\\.js$` });
    } else {
      return reject(`Function "${functionName}" not found`);
    }
  } else {
    const functionsRegex = allFunctions.map(name => `${name}\\.test\\.js$`).join('|');
    Object.assign(config, { testRegex: functionsRegex });
  }

  return runCLI({ config },
    serverless.config.servicePath,
    success => resolve(success));
});

module.exports = runTests;
