import { ArgsService } from './services/args.service';
import { ConfigService } from './services/config.service';
import { CopyService } from './services/copy.service';
import { FsService } from './services/fs.service';
import { MatchService } from './services/match.service';
import { ProgramService } from './services/program.service';
import { ShellService } from './services/shell.service';
import { TextReplacementService } from './services/text-replacement.service';
import { YarnService } from './services/yarn.service';

export const providers = [
  ArgsService,
  ConfigService,
  CopyService,
  FsService,
  MatchService,
  ProgramService,
  ShellService,
  TextReplacementService,
  YarnService
];
