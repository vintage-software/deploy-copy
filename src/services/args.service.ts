import { Injectable } from '@angular/core';

export interface Args {
  source?: string;
}

@Injectable()
export class ArgsService {
  readArgs(): Args {
    const args: { [index: string]: string } = {};
    for (let i = 2; i < process.argv.length; i++) {
      const match = process.argv[i].match(/-([a-z]+):(.+)/);
      args[match[1]] = match[2];
    }
    return args;
  }
}
