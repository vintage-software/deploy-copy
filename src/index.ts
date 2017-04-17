#! /usr/bin/env node

import 'reflect-metadata';

import { ReflectiveInjector } from '@angular/core';

import { providers } from './providers';
import { ProgramService } from './services/program.service';

process.on('uncaughtException', handleError);
process.on('unhandledRejection', handleError);

const injector = ReflectiveInjector.resolveAndCreate(providers);
const program: ProgramService = injector.get(ProgramService);

program.run();

function handleError(error: any) {
  console.error(error instanceof Error ? error.stack : `Error: ${error.toString()}`);
  process.exit(1);
}
