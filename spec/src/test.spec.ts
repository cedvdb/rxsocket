

import { RxSocket as RxSocketClient } from '../../client';
import { RxSocket as RxSocketServer } from '../../server';
import { first } from 'rxjs/operators';

describe('rx socket', () => {
  const createClient = () => new RxSocketClient({ url: 'ws://localhost:8080/ws'});
  const createServer = () => new RxSocketServer({ port: 8080 });

  const server = createServer();

  it('it should connect on the server', (done) => {
    server.connection$.pipe(first()).subscribe(_ => done());
    const client = createClient();
  });

  it('it should connect on the client', (done) => {
    const client = createClient();
    client.connection$.subscribe(_ => done());
  });
})


