import { RxSocket as RxSocketClient } from '../../client';
import { RxSocket as RxSocketServer } from '../../server';
import { LogLevel } from 'simply-logs';

export const createClient = () => new RxSocketClient({ url: 'ws://localhost:3001', logLevel: LogLevel.OFF });
export const createServer = () => new RxSocketServer({ rxSocket: { logLevel: LogLevel.OFF }, port: 3001 });

export const server = createServer();