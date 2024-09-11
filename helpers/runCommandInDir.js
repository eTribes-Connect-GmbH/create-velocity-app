import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

const runCommandInDir = (dir, command) => execAsync(`cd ${dir} && ${command}`);

export default runCommandInDir;
