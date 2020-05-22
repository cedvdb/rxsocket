

import { first, take } from 'rxjs/operators';
import { RxSocket as RxSocketClient } from '../../../client';
import { RxSocket as RxSocketServer } from '../../../server';

describe('Rx Socket Client - event emitter', () => {
  const createClient = () => new RxSocketClient({ url: 'ws://localhost:3002'});
  const createServer = () => new RxSocketServer({ port: 3002 });

  const server = createServer();
  let client: RxSocketClient;

  beforeEach(() => {
    client = createClient();
  });

  it('should emit connection', (done) => {
    client.connection$.pipe(first()).subscribe(_ => done());
  });

  it('should emit close', (done) => {
    client.close$.pipe(first()).subscribe(_ => done());
    client.close();
  });

  it('should emit dispatched', (done) => {
    client.dispatched$.pipe(first()).subscribe(_ => done());
    client.dispatch({ type: 'A' });
  });

  it('should emit received', (done) => {
    server.connection$.pipe(first())
      .subscribe(({ dispatch }) => dispatch({ type: 'TEST' }));
    client.received$.pipe(first()).subscribe(_ => done());
  });

  it('it should reconnect on abnormal close', (done) => {
    let i = 0;
    client.connection$.pipe(take(2)).subscribe(_ => {
      if (i === 1) {
        done();
      }
      i++;
    })
    setTimeout(() => client.close(1005), 200);
  });


  afterEach(() => client.close());
  afterAll(() => server.close());

});


