import { Injectable } from '@angular/core';
import * as program from 'commander';
import * as path from 'path';
import * as tmp from 'tmp';

import { ConfigService } from './config.service';
import { CopyService } from './copy.service';
import { FsService } from './fs.service';
import { MatchService } from './match.service';
import { TextReplacementService } from './text-replacement.service';
import { YarnService } from './yarn.service';
import { ZipService } from './zip.service';

@Injectable()
export class ProgramService {
  constructor(
    private configService: ConfigService,
    private copyService: CopyService,
    private fs: FsService,
    private matchService: MatchService,
    private textReplacementService: TextReplacementService,
    private yarnService: YarnService,
    private zipService: ZipService
  ) {}

  static get version(): string {
    const packageManifest = require('../../package.json');
    return packageManifest.version;
  }

  run() {
    program
      .version(ProgramService.version)
      .option('--cwd [cwd]', 'Change the current working directory for the process.')
      .option('--zip [filename]', 'Create a zip file instead of copying to deploy folder.')
      .parse(process.argv);

    const args = {
      cwd: program['cwd'] as string,
      zip: program['zip'] as string
    };

    const start = new Date();

    const sourceFolder = args.cwd ? path.resolve(args.cwd) : process.cwd();
    const destinationFolder = args.zip ? tmp.dirSync().name : path.join(path.dirname(sourceFolder), `${path.basename(sourceFolder)}-Deploy`);
    const tempFolder = `${destinationFolder}_TEMP`;

    console.log(`deploy-copy v${ProgramService.version}:`);
    console.log(`copying from ${sourceFolder} to ${destinationFolder}...`);

    this.fs.clean(destinationFolder);
    this.fs.clean(tempFolder);

    const configs = this.configService.getConfigs(sourceFolder);

    Promise.resolve()
      .then(() => this.yarnService.installProdDependencies(configs, sourceFolder, tempFolder))
      .then(() => this.matchService.matchPaths(configs, sourceFolder, tempFolder))
      .then(filePaths => this.copyService.copyFiles(sourceFolder, tempFolder, destinationFolder, filePaths))
      .then(() => this.textReplacementService.replaceText(configs, sourceFolder, destinationFolder))
      .then(() => args.zip ? this.zipService.zip(destinationFolder, args.zip) : Promise.resolve(undefined))
      .then(() => { this.fs.clean(tempFolder); })
      .then(() => {
        const end = new Date();
        const seconds = (end.getTime() - start.getTime()) / 1000;
        console.log(`Completed in ${seconds} seconds...`);
      });
  }
}
