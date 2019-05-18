import { promisify } from 'util';
import * as nodePath from 'path';

import mkdirpLib from 'mkdirp';
import rimrafLib from 'rimraf';
import uuid from 'uuid';
import osenv from 'osenv';

const mkdirp = promisify(mkdirpLib);
const rimraf = promisify(rimrafLib);

let path = nodePath; // Mocked in tests

export async function create(context) {
  if (context.options && context.options.tmpDir) {
    context.path = path.join(context.options.tmpDir, uuid.v4());
  } else {
    context.path = path.join(osenv.tmpdir(), uuid.v4());
  }
  context.emit(
    'data',
    'verbose',
    `${context.module.name} mk.tempdir`,
    context.path
  );

  context.homeDir = path.join(context.path, 'home');
  context.npmConfigTmp = path.join(context.path, 'npm_config_tmp');

  await mkdirp(context.homeDir);
  await mkdirp(context.npmConfigTmp);
}

export async function remove(context) {
  if (!context.path) {
    return;
  }
  context.emit(
    'data',
    'silly',
    `${context.module.name} rm.tempdir`,
    context.path
  );
  await rimraf(context.path);
}
