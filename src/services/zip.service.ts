import { Injectable } from '@angular/core';
import * as path from 'path';

import { FsService } from './fs.service';
import { ShellService } from './shell.service';

const _7z = require('7zip')['7z'];

@Injectable()
export class ZipService {
  constructor(private fs: FsService, private shell: ShellService) { }

  zip(folderPath: string, zipPath: string) {
    console.log(`zipping ${folderPath} to ${zipPath}...`);

    return this.shell.execute(`${_7z} a ${zipPath} ${path.join(folderPath, '*')}`)
      .then(() => this.fs.clean(folderPath));
  }
}
