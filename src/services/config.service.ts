import * as fs from 'fs';
import * as path from 'path';

import { Injectable } from '@angular/core';

export interface TextReplacement {
  path: string;
  searchText: string;
  replacementText: string;
}

export interface Config {
  cwd: string;
  exclude: string[];
  installProdNodeModules?: string[];
  textReplacements?: TextReplacement[];
}

@Injectable()
export class ConfigService {
  getCommonConfig(): Config {
    return this.readConfigFile(require.resolve('../../common.deploy.json'));
  }

  getConfigs(dir: string): Config[] {
    console.log('finding configs...');

    let filePaths = this.getConfigPaths(dir, []);

    return filePaths
      .map(filePath => this.readConfigFile(filePath));
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

  private readConfigFile(filePath: string): Config {
    let configJson = fs.readFileSync(filePath).toString();
    let config = JSON.parse(configJson);
    return Object.assign(config, { cwd: path.dirname(filePath) });
  }
}
