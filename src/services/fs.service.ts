import * as fs from 'fs-extra';
import * as rimraf from 'rimraf';

import { Injectable } from '@angular/core';

@Injectable()
export class FsService {
  clean(path: string) {
    console.log(`cleaning ${path}...`);
    return rimraf.sync(path);
  }

  copy(source: string, destination: string) {
    return new Promise<void>((resolve, reject) => {
      fs.copy(source, destination, error => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}
