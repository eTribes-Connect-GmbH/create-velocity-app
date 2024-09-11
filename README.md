# Create Velocity App

The easiest way to get started with Velocity!

This CLI tool enables the fast and easy creation of a new Velocity app based on the [Velocity Boilerplate](https://gitlab.com/etribes/velocity-boilerplate).

To get started, use the following command:

## Interactive

You can create a new project interactively by running:

```sh
npm create velocity-app
# or
yarn create velocity-app
# or
pnpm create velocity-app
# or
bun create velocity-app
```

You will be asked for the name of your project and about further configuration options.

## Non-interactive

You can also pass command line arguments to set up a new project non-interactively. Use the `--help` command line argument for more information.

```
Usage: create-velocity-app [directory] [options]

Options:
  -v, --version     Output the current version of create-velocity-app.
  --eslint          Initialize with ESLint config. (default)
  --prettier        Initialize with Prettier config. (default)
  --i18n            Initialize with i18n setup. (default, disabling not yet implemented)
  --openid-connect  Initialize with OpenID Connect demo integration. (default, disabling not yet implemented)
  --use-npm         Explicitly tell the CLI to bootstrap the application using npm.
  --use-pnpm        Explicitly tell the CLI to bootstrap the application using pnpm.
  --use-yarn        Explicitly tell the CLI to bootstrap the application using Yarn.
  --use-bun         Explicitly tell the CLI to bootstrap the application using Bun.
  --skip-install    Explicitly tell the CLI to skip installing packages.
  --yes             Use defaults for unprovided options.
  --disable-git     Skip initializing a git repository.
  -h, --help        Display this help message.
```