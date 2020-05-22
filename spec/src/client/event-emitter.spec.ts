

import { first, take } from 'rxjs/operators';
import { RxSocket as RxSocketClient } from '../../../client';
import { createClient, server } from '../server-client';

describe('Rx Socket Client - event emitter', () => {

  let client: RxSocketClient;

  beforeEach(() => client = createClient());
  afterEach(() => client.close());

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
    setTimeout(() => client.close(4000), 200);
  });

});


