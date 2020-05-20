import http, { ServerOptions } from 'http';
import { HttpServer } from './http-server.type';

const DEFAULT_PORT = 3000;

export function createSimpleServer(port = DEFAULT_PORT): HttpServer {
  const server = http.createServer();
  server.listen(port);
  return server;
}