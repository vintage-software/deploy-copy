import * as path from 'path';

import { Injectable } from '@angular/core';

import { ArgsService } from './args.service';
import { ConfigService } from './config.service';
import { CopyService } from './copy.service';
import { FsService } from './fs.service';
import { MatchService } from './match.service';
import { TextReplacementService } from './text-replacement.service';
import { YarnService } from './yarn.service';

@Injectable()
export class ProgramService {
  constructor(
    private argsService: ArgsService,
    private configService: ConfigService,
    private copyService: CopyService,
    private fs: FsService,
    private matchService: MatchService,
    private textReplacementService: TextReplacementService,
    private yarnService: YarnService
  ) {}

  get version(): string {
    let packageManifest = require('../../package.json');
    return packageManifest.version;
  }

  run() {
    const start = new Date();

    let processArgs = this.argsService.readArgs();

    let sourceFolder = processArgs.source ? path.resolve(processArgs.source) : process.cwd();
    let destinationFolder = path.join(path.dirname(sourceFolder), `${path.basename(sourceFolder)}-Deploy`);
    let tempFolder = `${destinationFolder}_TEMP`;

    console.log(`deploy-copy v${this.version}:`);
    console.log(`copying from ${sourceFolder} to ${destinationFolder}...`);

    this.fs.clean(destinationFolder);
    this.fs.clean(tempFolder);

    let configs = this.configService.getConfigs(sourceFolder);

    Promise.resolve()
      .then(() => this.yarnService.installProdDependencies(configs, sourceFolder, tempFolder))
      .then(() => this.matchService.matchPaths(configs, sourceFolder, tempFolder))
      .then(filePaths => this.copyService.copyFiles(sourceFolder, tempFolder, destinationFolder, filePaths))
      .then(() => this.textReplacementService.replaceText(configs, sourceFolder, destinationFolder))
      .then(() => { this.fs.clean(tempFolder); })
      .then(() => {
        let end = new Date();
        let seconds = (end.getTime() - start.getTime()) / 1000;
        console.log(`Completed in ${seconds} seconds...`);
      });
  }
}
