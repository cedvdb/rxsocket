

import { RxSocket as RxSocketClient } from '../../client';
import { RxSocket as RxSocketServer } from '../../server';
import { first, take } from 'rxjs/operators';
import { of } from 'rxjs';

describe('Rx Socket Client', () => {
  const createClient = () => new RxSocketClient({ url: 'ws://localhost:3002'});
  const createServer = () => new RxSocketServer({ port: 3002 });

  const server = createServer();

  it('should emit connection', (done) => {
    const client = createClient();
    client.connection$.pipe(first()).subscribe(_ => done());
  });

  it('it should emit close', (done) => {
    const client = createClient();
    client.close$.pipe(first()).subscribe(_ => done());
    client.close();
  });

  it('it should reconnect on close', (done) => {
    let i = 0;
    const client = createClient();
    client.connection$.pipe(take(2)).subscribe(_ => {
      if (i === 1) {
        done();
      }
      i++;
    })
    setTimeout(() => client.close(), 200);
  });

  it('should be able to react', (done) => {
    const client = createClient();
    server.select('TEST_ACTION')
      .pipe(take(1))
      .subscribe(({ type, react, payload }) => {
        react({ type: 'TEST_ACTION_RESPONSE', payload});
      });
    client.select('TEST_ACTION_RESPONSE')
      .pipe(first())
      .subscribe(({payload}) => {
        expect(payload).toEqual({ data: 'first' });
        done();
      });
    setTimeout(() => client.dispatch({ type: 'TEST_ACTION', payload: { data: 'first' }}), 100);
  });

  it('should select stream of actions', (done) => {
    const client = createClient();
    server.select('GIVE_STREAM')
      .pipe(take(1))
      .subscribe(({ react }) => {
        of(1, 2, 3).subscribe(i => react({ type: 'STREAM', payload: i}))
      });
    setTimeout(() => client.dispatch({ type: 'GIVE_STREAM'}), 100);
    client.select('STREAM')
      .pipe(take(3))
      .subscribe(({ type, payload}) => {
        if (payload === 3)
          done();
      });
  });

});


