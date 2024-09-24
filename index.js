#!/usr/bin/env node

import { Command } from "commander";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { readFile } from "node:fs/promises";
import colors from "picocolors";
import prompts from "prompts";
import createApp from "./createApp.js";
import getPkgManager from "./helpers/getPkgManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(
  await readFile(`${__dirname}/package.json`, "utf-8"),
);

const program = new Command(packageJson.name)
  .version(
    packageJson.version,
    "-v, --version",
    "Output the current version of create-velocity-app.",
  )
  .argument("[directory]")
  .usage("[directory] [options]")
  .helpOption("-h, --help", "Display this help message.")
  // .option('--ts, --typescript', 'Initialize as a TypeScript project. (default)')
  // .option('--js, --javascript', 'Initialize as a JavaScript project.')
  // .option('--tailwind', 'Initialize with Tailwind CSS config. (default)')
  .option("--eslint", "Initialize with ESLint config. (default)")
  .option("--prettier", "Initialize with Prettier config. (default)")
  .option(
    "--i18n",
    "Initialize with i18n setup. (default, disabling not yet implemented)",
  )
  .option(
    "--basic-auth",
    "Initialize with Basic Auth setup. (default, disabling not yet implemented)",
  )
  .option(
    "--openid-connect",
    "Initialize with OpenID Connect demo integration. (default, disabling not yet implemented)",
  )
  // .option('--import-alias <prefix/*>', 'Specify import alias to use (default "@/*").')
  // .option('--empty', 'Initialize an empty project.')
  .option(
    "--use-npm",
    "Explicitly tell the CLI to bootstrap the application using npm.",
  )
  .option(
    "--use-pnpm",
    "Explicitly tell the CLI to bootstrap the application using pnpm.",
  )
  .option(
    "--use-yarn",
    "Explicitly tell the CLI to bootstrap the application using Yarn.",
  )
  .option(
    "--use-bun",
    "Explicitly tell the CLI to bootstrap the application using Bun.",
  )
  .option(
    "--skip-install",
    "Explicitly tell the CLI to skip installing packages.",
  )
  .option("--yes", "Use defaults for unprovided options.")
  .option("--disable-git", "Skip initializing a git repository.")
  .parse(process.argv);

const defaultOptions = {
  projectDirectory: undefined,
  packageManager: undefined,
  // typescript: true,
  // tailwind: true,
  eslint: true,
  prettier: true,
  i18n: true,
  basicAuth: true,
  openidConnect: true,
  // importAlias: '@/*',
  // empty: false,
  skipInstall: false,
  disableGit: false,
};

const customOptions = program.opts();

customOptions.projectDirectory = program.args[0]?.trim();

customOptions.packageManager = !!customOptions.useNpm
  ? "npm"
  : !!customOptions.usePnpm
    ? "pnpm"
    : !!customOptions.useYarn
      ? "yarn"
      : !!customOptions.useBun
        ? "bun"
        : getPkgManager();

if (customOptions.yes && customOptions.projectDirectory) {
  createApp({ ...defaultOptions, ...customOptions });
} else {
  let cancelled = false;
  const response = await prompts(
    [
      {
        message: "What is your project named?",
        name: "projectDirectory",
        type: !customOptions.projectDirectory ? "text" : null,
        initial: "my-velocity-app",
      },
      // {
      //   type: customOptions.typescript === undefined ? 'toggle' : null,
      //   name: 'typescript',
      //   message: `Would you like to use ${colors.blue('TypeScript')}?`,
      //   initial: defaultOptions.typescript,
      //   active: 'Yes',
      //   inactive: 'No'
      // },
      // {
      //   type: customOptions.tailwind === undefined ? 'toggle' : null,
      //   name: 'tailwind',
      //   message: `Would you like to use ${colors.blue('Tailwind CSS')}?`,
      //   initial: defaultOptions.tailwind,
      //   active: 'Yes',
      //   inactive: 'No'
      // },
      {
        type: customOptions.eslint === undefined ? "toggle" : null,
        name: "eslint",
        message: `Would you like to use ${colors.blue("ESLint")}?`,
        initial: defaultOptions.eslint,
        active: "Yes",
        inactive: "No",
      },
      {
        type: customOptions.prettier === undefined ? "toggle" : null,
        name: "prettier",
        message: `Would you like to use ${colors.blue("Prettier")}?`,
        initial: defaultOptions.prettier,
        active: "Yes",
        inactive: "No",
      },
      {
        type: customOptions.i18n === undefined ? "toggle" : null,
        name: "i18n",
        message: `Would you like to include the ${colors.blue("i18n")} setup? (disabling not yet implemented)`,
        initial: defaultOptions.i18n,
        active: "Yes",
        inactive: "No",
      },
      {
        type: customOptions.basicAuth === undefined ? "toggle" : null,
        name: "basicAuth",
        message: `Would you like to include the ${colors.blue("Basic Auth")} setup? (disabling not yet implemented)`,
        initial: defaultOptions.basicAuth,
        active: "Yes",
        inactive: "No",
      },
      {
        type: customOptions.openidConnect === undefined ? "toggle" : null,
        name: "openidConnect",
        message: `Would you like to include the ${colors.blue(
          "OpenID Connect",
        )} demo integration? (disabling not yet implemented)`,
        initial: defaultOptions.openidConnect,
        active: "Yes",
        inactive: "No",
      },
    ],
    {
      onCancel: () => {
        cancelled = true;
      },
    },
  );
  if (!cancelled) {
    const newCustomOptions = { ...customOptions, ...response };
    createApp({ ...defaultOptions, ...newCustomOptions });
  }
}
