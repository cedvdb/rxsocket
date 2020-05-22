import { LogLevel } from 'simply-logs';


export interface Options {
  /** url to which the websocket connects */
  url: string;
  /** specify the log level to only get message >= to this log level */
  logLevel?: LogLevel;
  /** when the client is started on node */
  node?: boolean;
}