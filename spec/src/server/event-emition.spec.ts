
// import { RxSocket as RxSocketClient } from '../../../client';
// import { RxSocket as RxSocketServer } from '../../../server';
// import { first } from 'rxjs/operators';

// describe('Rx Socket Server - event emition', () => {
//   const createClient = () => new RxSocketClient({ url: 'ws://localhost:3001'});
//   const createServer = () => new RxSocketServer({ port: 3001 });

//   const server = createServer();
//   let client: RxSocketClient;

//   beforeEach(() => {
//     client = createClient();
//   });

//   it('should emit connection', (done) => {
//     server.connection$.pipe(first()).subscribe(_ => done());
//   });

//   it('should emit close', (done) => {
//     setTimeout(() => client.close(), 100);
//     server.close$.pipe(first()).subscribe(_ => done());
//   });

//   it('should emit received', (done) => {
//     client.dispatch({ type: 'A' });
//     server.received$.pipe(first()).subscribe(_ => done());
//   });

//   it('should emit dispatched', (done) => {
//     client.dispatch({ type: 'A' });
//     server.dispatched$.pipe(first()).subscribe(_ => done());
//     server.select('A')
//       .pipe(first())
//       .subscribe(({ dispatch }) => dispatch({ type: 'C' }));
//   });

//   it('should be able to do a dispatch in select', (done) => {
//     client.dispatch({ type: 'A' });
//     server.select('A')
//       .pipe(first())
//       .subscribe(({ dispatch }) => dispatch({ type: 'B' }));
//     client.select('B')
//       .pipe(first())
//       .subscribe(({ dispatch }) => dispatch({ type: 'C'}));
//     server.select('C').pipe(first())
//       .subscribe(_ => done());
//   });

//   it('should handle routing', (done) => {
//     let i = 0

//     const checkDone = (actionEvent: any) => {
//       if (!!actionEvent)
//         i++;
//       if (i === 3)
//         done();
//     }

//     server.route([
//       { type: 'A', handler: checkDone },
//       { type: 'B', handler: checkDone },
//       { type: 'C', handler: checkDone },
//     ]);

//     client
//       .dispatch({ type: 'A' })
//       .dispatch({ type: 'B' })
//       .dispatch({ type: 'C' });
//   });


// })


