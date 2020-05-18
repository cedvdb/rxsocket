

import { RxSocket as RxSocketClient } from '../../client';
import { RxSocket as RxSocketServer } from '../../server';
import { first, take } from 'rxjs/operators';
import { of } from 'rxjs';

describe('Rx Socket Client', () => {
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
    client.received$.pipe(first()).subscribe(_ => done());
    client.dispatch({ type: 'A' });
    server.select('A').pipe(first())
      .subscribe(({dispatch}) => dispatch({ type: 'B'}))
  });

  it('it should reconnect on close', (done) => {
    let i = 0;
    client.connection$.pipe(take(2)).subscribe(_ => {
      if (i === 1) {
        done();
      }
      i++;
    })
    setTimeout(() => client.close(), 200);
  });

  it('should dispatch round trip', (done) => {
    setTimeout(() => client.dispatch({ type: 'A' }), 100);
    server.select('A')
      .pipe(take(1))
      .subscribe(({ dispatch }) => dispatch({ type: 'B' }));
    client.select('B')
      .pipe(first())
      .subscribe(({dispatch}) => dispatch({ type: 'C', payload: 'TEST' }));
    client.select('C')
      .pipe(first())
      .subscribe(({payload}) => {
        expect(payload).toEqual('TEST');
        done();
      });
  });

  it('should select stream of actions', (done) => {
    setTimeout(() => client.dispatch({ type: 'GIVE_STREAM'}), 100);
    server.select('GIVE_STREAM')
      .pipe(take(1))
      .subscribe(({ dispatch: react }) => {
        of(1, 2, 3).subscribe(i => react({ type: 'STREAM', payload: i}))
      });
    client.select('STREAM')
      .pipe(take(3))
      .subscribe(({ type, payload}) => {
        if (payload === 3)
          done();
      });
  });

});


