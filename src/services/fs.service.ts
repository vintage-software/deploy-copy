import * as fs from 'fs-extra';
import * as path from 'path';
import * as rimraf from 'rimraf';

import { Injectable } from '@angular/core';

@Injectable()
export class FsService {
  clean(path: string) {
    console.log(`cleaning ${path}...`);
    return rimraf.sync(path);
  }

  copy(source: string, destination: string, filename?: string): Promise<void> {
    if (filename) {
      source = path.join(source, filename);
      destination = path.join(destination, filename);
    }

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
