

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
    client.dispatch({ type: 'A' });
    server.select('A').pipe(first())
      .subscribe(({dispatch}) => dispatch({ type: 'B'}))
    client.received$.pipe(first()).subscribe(_ => done());
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

  it('should be able to do a dispatch round trip', (done) => {
    client.dispatch({ type: 'A', payload: 'TEST' });
    server.select('A')
      .pipe(take(1))
      .subscribe(({ dispatch, payload }) => dispatch({ type: 'B', payload }));
    client.select('B')
      .pipe(first())
      .subscribe(({ dispatch, payload }) => dispatch({ type: 'C', payload }));
    server.select('C')
      .pipe(first())
      .subscribe(({ payload }) => {
        expect(payload).toEqual('TEST');
        done();
      });
  });

  it('should select stream of actions', (done) => {
    client.dispatch({ type: 'GIVE_STREAM'});
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

  it('should handle routing', (done) => {
    let i = 0

    const checkDone = (actionEvent: any) => {
      if (!!actionEvent)
        i++;
      if (i === 3)
        done();
    }

    client.route([
      { type: 'A', handler: checkDone },
      { type: 'B', handler: checkDone },
      { type: 'C', handler: checkDone },
    ]);

    client.dispatch({ type: 'TEST' });
    server.select('TEST')
      .pipe(first())
      .subscribe(({dispatch}) => {
        dispatch({ type: 'A' });
        dispatch({ type: 'B' });
        dispatch({ type: 'C' });
      });
  });

});


