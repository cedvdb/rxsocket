import { LogLevel } from 'simply-logs';


export interface Config {
  url: string;
  rxSocket?: { logLevel?: LogLevel; }
}