import degit from 'degit';
import { copyFile, unlink as deleteFile, readFile, writeFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';
import colors from 'picocolors';
import runCommandInDir from './helpers/runCommandInDir.js';

const createApp = async config => {
  // Parse project directory and app name
  config.projectDirectory = resolve(config.projectDirectory);
  config.appName = basename(config.projectDirectory);

  // Download template/boilerplate
  console.log('Downloading project template...');
  try {
    const emitter = degit('gitlab:etribes/velocity-boilerplate', { cache: false, force: true, verbose: true });
    await emitter.clone(config.projectDirectory);
  } catch {
    console.log(`${colors.red('Error!')} We were unable to download the project template.`);
    return;
  }

  // Update app name in package.json
  const packageJsonText = await readFile(join(config.projectDirectory, 'package.json'), 'utf-8');
  const packageJson = JSON.parse(packageJsonText);
  packageJson.name = config.appName;
  await writeFile(path, JSON.stringify(packageJson, null, 2), 'utf-8');

  // ESLint
  if (!config.eslint) {
    await deleteFile(join(config.projectDirectory, '.eslintrc'));
    // TODO: Remove dependency
  }

  // Prettier
  if (!config.prettier) {
    await deleteFile(join(config.projectDirectory, '.prettierrc'));
    // TODO: Remove dependency
  }

  // Create local .env
  await copyFile(join(config.projectDirectory, 'example.env'), join(config.projectDirectory, '.env'));

  // Install dependencies
  if (!config.skipInstall) {
    console.log('Installing dependencies...');
    if (config.packageManager !== 'npm') {
      await deleteFile(join(config.projectDirectory, 'package-lock.json'));
    }
    await runCommandInDir(config.projectDirectory, `${config.packageManager} install`);
  }

  // Git
  if (config.disableGit) {
    await deleteFile(join(config.projectDirectory, '.gitignore'));
  } else {
    await runCommandInDir(config.projectDirectory, 'git init');
  }

  // Success!
  console.log(`${colors.green('Success!')} Created ${config.appName} at ${config.projectDirectory}`);
  console.log('Inside that directory, you can run several commands:');
  console.log();
  console.log(colors.cyan(`  ${config.packageManager} ${config.packageManager === 'yarn' ? '' : 'run '}dev`));
  console.log('    Starts the development server.');
  console.log();
  console.log(colors.cyan(`  ${config.packageManager} ${config.packageManager === 'yarn' ? '' : 'run '}build`));
  console.log('    Builds the app for production.');
  console.log();
  console.log(colors.cyan(`  ${config.packageManager} start`));
  console.log('    Runs the built app in production mode.');
  console.log();
  console.log('We suggest that you begin by typing:');
  console.log();
  console.log(`  ${colors.cyan('cd')} ${config.projectDirectory}`);
  console.log(`  ${colors.cyan(`${config.packageManager} ${config.packageManager === 'yarn' ? '' : 'run '}dev`)}`);
};

export default createApp;
