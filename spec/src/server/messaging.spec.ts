


import { of } from 'rxjs';
import { first, take } from 'rxjs/operators';
import { RxSocket as RxSocketClient } from '../../../client';
import { createClient, server } from '../server-client';

describe('Rx Socket Server - messaging', () => {

  let client: RxSocketClient;

  beforeEach(() => client = createClient());
  afterEach((done) => client.close().then(_ => done()));

  it('should be able to do a round trip via select', (done) => {
    client.dispatch({ type: 'A' });
    server.select('A')
      .pipe(first())
      .subscribe(({ dispatch }) => dispatch({ type: 'B' }));
    client.select('B')
      .pipe(first())
      .subscribe(({ dispatch }) => dispatch({ type: 'C'}));
    server.select('C').pipe(first())
      .subscribe(_ => done());
  });

  it('should select stream of actions', (done) => {
    of(1, 2, 3).subscribe(i => client.dispatch({ type: 'STREAM', payload: i}))
    server.select('STREAM')
      .pipe(take(3))
      .subscribe(({ type, payload}) => {
        if (payload === 3)
          done();
      });
  });

  it('should be able to broadcast to all online users', (done) => {
    server.connection$.pipe(first())
      .subscribe(_ => server.broadcast({ type: 'TEST' }));
    client.select('TEST').pipe(first()).subscribe(_ => done())
  });

  it('should be able to do a broadcast in room', (done) => {
    server.connection$.pipe(first())
      .subscribe(connection => {
        // negative testing should be done here where the user doesn't receive the msg
        server.addToRoom('TEST', connection);
        server.broadcast({ type: 'FAIL' }, [connection], 'TEST');
        server.broadcast({ type: 'PASS' }, [], 'TEST');
        client.received$.subscribe(actionEvent => {
          expect(actionEvent.type).not.toEqual('FAIL');
          expect(actionEvent.type).toEqual('PASS');
          done();
        })
      });
    client.select('TEST').pipe(first()).subscribe(_ => done())
  });

});





