

import { RxSocket as RxSocketClient } from '../../../client';
import { RxSocket as RxSocketServer } from '../../../server';
import { first } from 'rxjs/operators';

describe('Rx Socket Client - routing', () => {
  const createClient = () => new RxSocketClient({ url: 'ws://localhost:3001'});
  const createServer = () => new RxSocketServer({ port: 3001 });

  const server = createServer();
  let client: RxSocketClient;

  beforeEach(() => {
    client = createClient();
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
      .subscribe(({ dispatch }) => {
        dispatch({ type: 'A' });
        dispatch({ type: 'B' });
        dispatch({ type: 'C' });
      });
  });
  afterEach(() => client.close());
  afterAll(() => server.close());

});


