
import { first } from 'rxjs/operators';
import { RxSocket as RxSocketClient } from '../../../client';
import { createClient, server } from '../server-client';

describe('Rx Socket Server - event emitter', () => {
  let client: RxSocketClient;

  beforeEach(() => client = createClient());
  afterEach(() => client.close());

  it('should emit connection', (done) => {
    server.connection$.pipe(first()).subscribe(_ => done());
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

  it('should emit close', (done) => {
    setTimeout(() => client.close(), 100);
    server.close$.pipe(first()).subscribe(_ => done());
  });

});


