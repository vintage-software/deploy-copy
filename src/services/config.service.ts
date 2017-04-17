import * as fs from 'fs';
import * as path from 'path';

import { Injectable } from '@angular/core';

export interface Config {
  cwd: string;
  exclude: string[];
  installProdNodeModules?: string[];
}

@Injectable()
export class ConfigService {
  getCommonConfig(): Config {
    return require('../../common.deploy.json');
  }

  getConfigs(dir: string): Config[] {
    console.log('finding configs...');

    let filePaths = this.getConfigPaths(dir, []);

    return filePaths
      .map(filePath => Object.assign(require(filePath), { cwd: path.dirname(filePath) }));
  }

  private getConfigPaths(dir: string, filelist: string[] = []): string[] {
    let filePaths = fs.readdirSync(dir);
    for (let filePath of filePaths) {
      let absolutePath = path.join(dir, filePath);
      if (fs.statSync(absolutePath).isDirectory() && !absolutePath.includes('node_modules')) {
        filelist = this.getConfigPaths(absolutePath, filelist);
      } else if (absolutePath.endsWith('deploy.json')) {
        filelist = filelist.concat(absolutePath);
      }
    }

    return filelist;
  }
}
