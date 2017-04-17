/// <reference path="../types/globby.d.ts" />

import * as globby from 'globby';

import { Injectable } from '@angular/core';

import { Config, ConfigService } from './config.service';

@Injectable()
export class MatchService {
  constructor(private configService: ConfigService) {
  }

  matchPaths(configs: Config[]) {
    console.log('matching paths...');

    const commonExclude = this.configService.getCommonConfig().exclude;

    let matchPromises = configs
      .map(config => {
        let excludes = []
          .concat(commonExclude)
          .concat(config.exclude)
          .map(path => path.startsWith('!') ? path.substring(1) : `!${path}`);

        let src = ['./**/*.*']
          .concat(excludes);

        return globby(src, { cwd: config.cwd })
          .then(paths => paths.map(path => path.replace('./', `${config.cwd}\\`)));
      });

    return Promise.all(matchPromises)
      .then(results => results.reduce((previous, current) => previous.concat(current), []));
  }
}
