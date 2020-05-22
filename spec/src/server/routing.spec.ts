

import { RxSocket as RxSocketClient } from '../../../src/client';
import { createClient, server } from '../server-client';

describe('Rx Socket Server - routing', () => {

  let client: RxSocketClient;

  beforeEach(() => client = createClient());
  afterEach((done) => client.close().then(_ => done()));


  it('should handle routing', (done) => {
    let i = 0

    const checkDone = (actionEvent: any) => {
      if (!!actionEvent)
        i++;
      if (i === 3)
        done();
    }

    server.route([
      { type: 'A', handler: checkDone },
      { type: 'B', handler: checkDone },
      { type: 'C', handler: checkDone },
    ]);

    client.dispatch({ type: 'A' })
    client.dispatch({ type: 'B' })
    client.dispatch({ type: 'C' });
  });

});


