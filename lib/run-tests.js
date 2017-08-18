'use strict';

const runCLI = require('jest').runCLI;
const BbPromise = require('bluebird');
const { setEnv } = require('./utils');
const _ = require('lodash');

const jestCliAvailableArgv = [
  'bail',
  'cache',
  'collectCoverageFrom',
  'colors',
  'config',
  'coverage',
  'debug',
  'env',
  'expand',
  'findRelatedTests',
  'forceExit',
  'help',
  'json',
  'outputFile',
  'lastCommit',
  'logHeapUsage',
  'maxWorkers',
  'noStackTrace',
  'notify',
  'onlyChanged',
  'runInBand',
  'setupTestFrameworkScriptFile',
  'showConfig',
  'silent',
  'testNamePattern',
  'testPathPattern',
  'testRunner',
  'updateSnapshot',
  'useStderr',
  'verbose',
  'version',
  'watch',
  'watchAll',
  'watchman',
]

const runTests = (serverless, options) => new BbPromise((resolve, reject) => {
  const functionName = options.function;
  const allFunctions = serverless.service.getAllFunctions();
  const jestCliOptions = _.pick(options, jestCliAvailableArgv)
console.log(jestCliOptions)
  const config = {
    testEnvironment: 'node',
    jestCliOptionsi,
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
