import { format } from 'util';

import semver from 'semver';
import updateNotifier from 'update-notifier';

import pkg from '../package.json';

export function update(log) {
  updateNotifier({
    pkg: pkg,
    name: pkg.name,
    callback: function(error, update) {
      if (update && semver.gt(update.latest, update.current)) {
        log.warn(
          'update-available',
          format(
            'v%s (current: v%s)\nnpm install -g %s',
            update.latest,
            update.current,
            pkg.name
          )
        );
      }
    }
  });
}
