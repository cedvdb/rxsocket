import { LogLevel } from 'simply-logs';
import WebSocket from 'ws';

export interface Options extends WebSocket.ServerOptions {
  logLevel?: LogLevel;
}