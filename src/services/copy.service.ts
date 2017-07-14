import { Injectable } from '@angular/core';
import * as ProgressBar from 'progress';

import { FsService } from './fs.service';

@Injectable()
export class CopyService {
  constructor(private fs: FsService) {
  }

  copyFiles(sourceFolder: string, tempFolder: string, destinationFolder: string, filePaths: string[]) {
    console.log(`copying ${filePaths.length} files...`);

    const progressBar = new ProgressBar(
      '[:bar] :percent',
      { total: filePaths.length, width: (<any>process.stdout).columns - 10 });

    const copyPromises = filePaths
      .map(filePath => {
        let destinationPath: string;

        if (filePath.startsWith(tempFolder)) {
          destinationPath = filePath.replace(tempFolder, destinationFolder);
        } else if (filePath.startsWith(sourceFolder)) {
          destinationPath = filePath.replace(sourceFolder, destinationFolder);
        } else {
          throw new Error(`cannot determine where to copy ${filePath}.`);
        }

        return this.fs.copy(filePath, destinationPath)
          .then(() => progressBar.tick(), () => progressBar.tick());
      });

    return Promise.all(copyPromises);
  }
}
