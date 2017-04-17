/// <reference path="../types/globby.d.ts" />

import * as globby from 'globby';
import * as path from 'path';

import { Injectable } from '@angular/core';

import { Config, ConfigService } from './config.service';

const nodeModuleCopyPaths = [
  'node_modules/**/*.js',
  'node_modules/**/*.json'
];

@Injectable()
export class MatchService {
  constructor(private configService: ConfigService) {
  }

  matchPaths(configs: Config[], sourceFolder: string, tempFolder: string) {
    console.log('matching paths...');

    const commonExclude = this.configService.getCommonConfig().exclude;

    let matchPromises = configs
      .map(config => {
        let excludes = []
          .concat(commonExclude)
          .concat(config.exclude)
          .map(path => path.startsWith('!') ? path.substring(1) : `!${path}`);

        let deps = (config.installProdNodeModules || [])
          .map(projectPath => nodeModuleCopyPaths.map(depGlob => path.join(config.cwd, projectPath, depGlob)))
          .reduce((previous, current) => previous.concat(current), [])
          .map(depGlob => depGlob.replace(sourceFolder, tempFolder));

        let src = ['./**/*.*']
          .concat(excludes);

        return this.matchGlobPaths(src, config.cwd)
          .then(srcPaths => this.matchGlobPaths(deps, sourceFolder).then(depPaths => [].concat(srcPaths).concat(depPaths)));
      });

    return Promise.all(matchPromises)
      .then(results => results.reduce((previous, current) => previous.concat(current), []));
  }

  private matchGlobPaths(globPaths: string[], cwd: string) {
    return globby(globPaths, { cwd, nodir: true })
      .then(filePaths => filePaths.map(filePath => path.resolve(cwd, filePath)));
  }
}
