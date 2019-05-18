import { install } from './install';
import { test } from './test';
import { getExecutable } from './get-executable';

function pkgInstall(context) {
  if (context.options.yarn || context.module.useYarn) {
    return install('yarn', context);
  } else {
    return install('npm', context);
  }
}

function pkgTest(context) {
  if (context.options.yarn || context.module.useYarn) {
    return test('yarn', context);
  } else {
    return test('npm', context);
  }
}

export async function getPackageManagers() {
  const [npm, yarn] = await Promise.all([
    getExecutable('npm'),
    getExecutable('yarn')
  ]);
  return { npm, yarn };
}

export { pkgInstall as install, pkgTest as test };
