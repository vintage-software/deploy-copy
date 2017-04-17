import * as ProgressBar from 'progress';

import { Injectable } from '@angular/core';

import { FsService } from './fs.service';

@Injectable()
export class CopyService {
  constructor(private fs: FsService) {
  }

  copyFiles(sourceFolder: string, destinationFolder: string, filePaths: string[]) {
    console.log(`copying ${filePaths.length} files...`);

    let progressBar = new ProgressBar(
      '[:bar] :percent',
      { total: filePaths.length, width: (<any>process.stdout).columns - 10 });

    let copyPromises = filePaths
      .map(filePath => {
        let destinationPath = filePath.replace(sourceFolder, destinationFolder);

        return this.fs.copy(filePath, destinationPath)
          .then(() => progressBar.tick(), () => progressBar.tick());
      });

    return Promise.all(copyPromises);
  }
}
