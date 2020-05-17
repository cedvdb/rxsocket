

import { RxSocket as RxSocketClient } from '../../client';
import { RxSocket as RxSocketServer } from '../../server';
import { first, take } from 'rxjs/operators';
import { of } from 'rxjs';

describe('rx socket', () => {
  const createClient = () => new RxSocketClient({ url: 'ws://localhost:3000'});
  const createServer = () => new RxSocketServer();

  const server = createServer();

  it('should emit connection', (done) => {
    server.connection$.pipe(first()).subscribe(_ => done());
    createClient();
  });

  it('should emit close', (done) => {
    server.close$.pipe(first()).subscribe(_ => done());
    const client = createClient();
    setTimeout(() => client.close(), 100);
  });

  it('should be able to react', (done) => {
    const client = createClient();
    setTimeout(() => client.dispatch({ type: 'HELLO' }), 100);
    server.select('HELLO').pipe(first())
      .subscribe(({ react }) => react({ type: 'WASSUP' }));
    client.select('WASSUP').pipe(first())
      .subscribe(({react}) => react({ type: 'NOT_MUCH'}));
    server.select('NOT_MUCH').pipe(first())
      .subscribe(_ => done());
  });


})


