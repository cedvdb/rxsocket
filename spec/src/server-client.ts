import { RxSocket as RxSocketClient } from '../../src/client';
import { RxSocket as RxSocketServer } from '../../src/server';
import { LogLevel } from 'simply-logs';

export const createClient = () => new RxSocketClient({ url: 'ws://localhost:3001', rxSocket: { logLevel: LogLevel.OFF }});
export const createServer = () => new RxSocketServer({ rxSocket: { logLevel: LogLevel.OFF }, port: 3001 });

export const server = createServer();