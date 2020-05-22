import { RxSocket as RxSocketClient } from '../../src/client';
import { RxSocket as RxSocketServer } from '../../src/server';
import { LogLevel } from 'simply-logs';

export const createClient = () => new RxSocketClient({ url: 'ws://localhost:3001', logLevel: LogLevel.OFF, node: true });
export const createServer = () => new RxSocketServer({ logLevel: LogLevel.OFF, port: 3001 });

export const server = createServer();