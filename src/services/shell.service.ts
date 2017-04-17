import { exec, ExecOptions } from 'child_process';

import { Injectable } from '@angular/core';

export interface ExecResult {
  cwd: string;
  command: string;
  error: Error;
  stdout: string;
  stderr: string;
}

@Injectable()
export class ShellService {
  execute(command: string, options?: ExecOptions): Promise<ExecResult> {
    let cwd = options.cwd || process.cwd();

    return new Promise<ExecResult>((resolve, reject) => {
      exec(command, options, (error, stdout, stderr) => {
        let result: ExecResult = { cwd, command, error, stdout, stderr };

        if (error) {
          reject(result);
        } else {
          resolve(result);
        }
      });
    });
  }
}
