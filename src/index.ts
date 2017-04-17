#! /usr/bin/env node

/// <reference path="./types/globby.d.ts" />

'use strict';

import * as fs from 'fs-extra';
import * as globby from 'globby';
import * as path from 'path';
import * as ProgressBar from 'progress';
import * as rimraf from 'rimraf';

import { Args, Config } from './helpers';

process.on('uncaughtException', handleError);
process.on('unhandledRejection', handleError);

const start = new Date();

let processArgs = readArgs();

let sourceFolder = processArgs.source ? path.resolve(processArgs.source) : process.cwd();
let destinationFolder = path.join(path.dirname(sourceFolder), `${path.basename(sourceFolder)}-Deploy`);

console.log(`copying from ${sourceFolder} to ${destinationFolder}...`);

let commonConfig: Config = require('../common.deploy.json');
let commonExclude = commonConfig.exclude.map(i => `!${i}`);

console.log('cleaning...');
rimraf.sync(destinationFolder);

console.log('finding configs...');
let configFilePaths = getConfigs(sourceFolder);

console.log('matching paths...');
let matchPromises = [];
for (let i = 0; i < configFilePaths.length; ++i) {
  let configFilePath = configFilePaths[i];
  let configDir = path.dirname(configFilePath);

  let config: Config = require(configFilePath);
  let src = ['./**/*.*']
    .concat(commonExclude)
    .concat(config.exclude.map(path => `!${path}`));

  let matchPromise = globby(src, { cwd: configDir })
    .then(paths => paths.map(path => path.replace('./', `${configDir}\\`)));

  matchPromises.push(matchPromise);
}

Promise.all(matchPromises).then(results => {
  let files = [].concat.apply([], results);
  console.log(`copying ${files.length} files...`);
  let progressBar = new ProgressBar(
    '[:bar] :percent',
    { total: files.length, width: (<any>process.stdout).columns - 10 });
  let copyPromises = [];
  for (let i = 0; i < files.length; ++i) {
    let file = files[i];
    let dest = file.replace(sourceFolder, destinationFolder);

    let copyPromise = copy(file, dest)
      .then(() => progressBar.tick(), () => progressBar.tick());

    copyPromises.push(copyPromise);
  }

  return Promise.all(copyPromises);
}).then(() => {
  let end = new Date();
  let seconds = (end.getTime() - start.getTime()) / 1000;
  console.log(`Completed in ${seconds} seconds...`);
});

function readArgs(): Args {
  let args: { [index: string]: string } = {};
  for (let i = 2; i < process.argv.length; i++) {
    let match = process.argv[i].match(/-([a-z]+):(.+)/);
    args[match[1]] = match[2];
  }
  return args;
}

function getConfigs(dir: string, filelist: string[] = []): string[] {
  let filePaths = fs.readdirSync(dir);
  for (let filePath of filePaths) {
    let absolutePath = path.join(dir, filePath);
    if (fs.statSync(absolutePath).isDirectory() && !absolutePath.includes('node_modules')) {
      filelist = getConfigs(absolutePath, filelist);
    } else if (absolutePath.endsWith('deploy.json')) {
      filelist = filelist.concat(absolutePath);
    }
  }

  return filelist;
}

function copy(source: string, destination: string) {
  return new Promise<void>((resolve, reject) => {
    fs.copy(source, destination, error => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

function handleError(error: any) {
  console.error(error instanceof Error ? error.stack : `Error: ${error.toString()}`);
  process.exit(1);
}
