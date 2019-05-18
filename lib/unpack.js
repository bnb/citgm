import { exists, createReadStream } from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import { createGunzip } from 'zlib';

import mkdirpLib from 'mkdirp';

import stream from 'readable-stream';
import tar from 'tar';

const fsExists = promisify(exists);
const pipeline = promisify(stream.pipeline);
const mkdirp = promisify(mkdirpLib);

export async function unpack(context) {
  if (typeof context.unpack === 'string') {
    const exists = await fsExists(context.unpack);
    if (!exists) {
      throw new Error('Nothing to unpack... Ending');
    }
    const extractPath = join(context.path, context.module.name);
    await mkdirp(extractPath);
    context.emit(
      'data',
      'silly',
      `${context.module.name} gzip-unpack-start`,
      context.unpack
    );
    const inp = createReadStream(context.unpack);
    const gzip = createGunzip();
    const out = tar.extract({
      cwd: extractPath,
      strip: 1
    });
    await pipeline(inp, gzip, out);
    context.emit(
      'data',
      'silly',
      `${context.module.name} gzip-unpack-done`,
      context.unpack
    );
  } else if (context.unpack === false) {
    return;
  } else {
    throw new Error('Nothing to unpack... Ending');
  }
}
