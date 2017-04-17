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
    console.log('installing production dependencies...');

    let yarnPromises = configs
      .filter(config => !!config.installProdNodeModules)
      .map(config => config.installProdNodeModules.map(projectPath => ({ config, path: projectPath})))
      .reduce(projects => projects.reduce((previous, current) => previous.concat(current), []))
      .map(project => {
        let sourcePath = path.resolve(project.config.cwd, project.path);
        let tempPath = sourcePath.replace(sourceFolder, tempFolder);

        return this.fs.copy(sourcePath, tempPath, 'package.json')
          .then(() => this.fs.copy(sourcePath, tempPath, 'yarn.lock'))
          .then(() => this.shell.execute('yarn --production --pure-lockfile', { cwd: tempPath }));
      });

    return Promise.all(yarnPromises);
  }
}
