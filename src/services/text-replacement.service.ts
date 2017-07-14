import { Injectable } from '@angular/core';
import * as fs from 'fs';
import * as path from 'path';

import { Config } from './config.service';

@Injectable()
export class TextReplacementService {
  replaceText(configs: Config[], sourceFolder: string, destinationFolder: string) {
    console.log('performing text replacements...');

    for (const config of configs) {
      for (const textReplacement of config.textReplacements || []) {
        const filePath = path.resolve(path.join(config.cwd.replace(sourceFolder, destinationFolder), textReplacement.path));
        this.replaceInFile(filePath, textReplacement.searchText, textReplacement.replacementText);
      }
    }
  }

  private replaceInFile(filePath: string, searchText: string, replacementText: string) {
    const fileContents = fs.readFileSync(filePath).toString();
    const newFileContents = fileContents.split(searchText).join(replacementText);
    fs.writeFileSync(filePath, newFileContents);
  }
}
