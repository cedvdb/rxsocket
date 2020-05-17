import chalk from 'chalk';
import log from 'loglevel';
import prefix from 'loglevel-plugin-prefix';

type Level = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
const colors = {
  TRACE: chalk.magenta,
  DEBUG: chalk.cyan,
  INFO: chalk.blue,
  WARN: chalk.yellow,
  ERROR: chalk.red,
};

prefix.reg(log);
prefix.apply(log, {
  format(level, timestamp) {
    return `${chalk.gray(`${timestamp}`)} ${colors[level.toUpperCase() as Level](`[${level}]`)}`;
  }
});
