import * as path from 'path';

import { Injectable } from '@angular/core';

import { Config } from './config.service';
import { FsService } from './fs.service';
import { ShellService } from './shell.service';

@Injectable()
export class YarnService {
  constructor(private fs: FsService, private shell: ShellService) {
  }

  installProdDependencies(configs: Config[], sourceFolder: string, tempFolder: string) {
    let projectPaths = configs
      .filter(config => !!config.installProdNodeModules)
      .map(config => config.installProdNodeModules.map(projectPath => path.resolve(config.cwd, projectPath)))
      .reduce((previous, current) => previous.concat(current), []);

    if (projectPaths.length) {
      console.log('installing production dependencies...');
    }

    let yarnPromises = projectPaths
      .map(projectPath => {
        let tempPath = projectPath.replace(sourceFolder, tempFolder);

        return this.fs.copy(projectPath, tempPath, 'package.json')
          .then(() => this.fs.copy(projectPath, tempPath, 'yarn.lock'))
          .then(() => this.shell.execute('yarn --production --pure-lockfile', { cwd: tempPath }));
      });

    return Promise.all(yarnPromises);
  }
}
