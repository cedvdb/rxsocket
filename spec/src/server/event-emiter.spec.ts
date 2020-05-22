
import { first } from 'rxjs/operators';
import { RxSocket as RxSocketClient } from '../../../client';
import { RxSocket as RxSocketServer } from '../../../server';

describe('Rx Socket Server - event emitter', () => {
  const createClient = () => new RxSocketClient({ url: 'ws://localhost:3001'});
  const createServer = () => new RxSocketServer({ port: 3001 });

  const server = createServer();
  let client: RxSocketClient;

  beforeEach(() => {
    client = createClient();
  });

  it('should emit connection', (done) => {
    server.connection$.pipe(first()).subscribe(_ => done());
  });

  it('should emit close', (done) => {
    setTimeout(() => client.close(), 100);
    server.close$.pipe(first()).subscribe(_ => done());
  });

  it('should emit received', (done) => {
    client.dispatch({ type: 'A' });
    server.received$.pipe(first()).subscribe(_ => done());
  });

  it('should emit dispatched', (done) => {
    server.connection$.pipe(
      first()
    ).subscribe(({ dispatch }) => dispatch({ type: 'C' }));
    server.dispatched$.pipe(first()).subscribe(_ => done());
  });

  afterEach(() => client.close());
  afterAll(() => server.close());

});


