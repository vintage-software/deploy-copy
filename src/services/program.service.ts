import * as path from 'path';

import { Injectable } from '@angular/core';

import { ArgsService } from './args.service';
import { ConfigService } from './config.service';
import { CopyService } from './copy.service';
import { FsService } from './fs.service';
import { MatchService } from './match.service';

@Injectable()
export class ProgramService {
  constructor(
    private argsService: ArgsService,
    private configService: ConfigService,
    private copyService: CopyService,
    private fs: FsService,
    private matchService: MatchService
  ) {}

  run() {
    const start = new Date();

    let processArgs = this.argsService.readArgs();

    let sourceFolder = processArgs.source ? path.resolve(processArgs.source) : process.cwd();
    let destinationFolder = path.join(path.dirname(sourceFolder), `${path.basename(sourceFolder)}-Deploy`);

    console.log(`copying from ${sourceFolder} to ${destinationFolder}...`);

    this.fs.clean(destinationFolder);

    let configs = this.configService.getConfigs(sourceFolder);

    return Promise.resolve()
      .then(() => this.matchService.matchPaths(configs))
      .then(filePaths => this.copyService.copyFiles(sourceFolder, destinationFolder, filePaths))
      .then(() => {
        let end = new Date();
        let seconds = (end.getTime() - start.getTime()) / 1000;
        console.log(`Completed in ${seconds} seconds...`);
      });
  }
}
