

import { RxSocket as RxSocketClient } from '../../client/core/rx-socket.class';
import { RxSocket as RxSocketServer } from '../../server/core/rx-socket.class';


export const createClient = () => new RxSocketClient({ url: 'ws://localhost:3000/ws'});
export const createServer = () => new RxSocketServer();

const server = createServer();

server.open$.subscribe(_ => console.log('connection opened'));
server.select('TEST').subscribe(() => 'test received');

setTimeout(() => {
  const client = createClient();
  console.log('starting client');
  client.open$.subscribe(_ => console.log('client connected'))
}, 1000)