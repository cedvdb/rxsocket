import { of } from 'rxjs';
import { first, take } from 'rxjs/operators';
import { RxSocket as RxSocketClient } from '../../../client';
import { createClient, server } from '../server-client';

describe('Rx Socket Client - messaging', () => {

  let client: RxSocketClient;

  beforeEach(() => client = createClient());
  afterEach((done) => client.close().then(_ => done()));

  it('should be able to do a dispatch round trip', (done) => {
    client.dispatch({ type: 'A', payload: 'TEST' });
    server.select('A')
      .pipe(first())
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
      .pipe(first())
      .subscribe(({ dispatch }) => {
        of(1, 2, 3).subscribe(i => dispatch({ type: 'STREAM', payload: i}))
      });
    client.select('STREAM')
      .pipe(take(3))
      .subscribe(({ type, payload}) => {
        if (payload === 3)
          done();
      });
  });

});







