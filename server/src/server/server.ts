import http from 'http';
import { HttpServer } from './http-server.type';

const SERVER_DEFAULT = {
  port: 3000,
  staticDir: 'public',
}

export function createSimpleServer(): HttpServer {
  const server = http.createServer();
  server.listen(SERVER_DEFAULT.port);
  return server;
}