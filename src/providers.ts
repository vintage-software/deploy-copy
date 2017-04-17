import { ArgsService } from './services/args.service';
import { ConfigService } from './services/config.service';
import { CopyService } from './services/copy.service';
import { FsService } from './services/fs.service';
import { MatchService } from './services/match.service';
import { ProgramService } from './services/program.service';

export const providers = [
  ArgsService,
  ConfigService,
  CopyService,
  FsService,
  MatchService,
  ProgramService
];
