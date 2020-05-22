

import { RxSocket as RxSocketClient } from '../../../client';
import { RxSocket as RxSocketServer } from '../../../server';
import { take, first } from 'rxjs/operators';

describe('Rx Socket Server - rooms', () => {
  const createClient = () => new RxSocketClient({ url: 'ws://localhost:3001'});
  const createServer = () => new RxSocketServer({ port: 3001 });

  const server = createServer();
  let client: RxSocketClient;

  beforeEach(() => {
    client = createClient();
  });

  it('should add user to online users', (done) => {
    server.connection$.pipe(take(1))
      .subscribe(connection => {
        const added = server.onlineUsers.has(connection.id);
        expect(added).toBe(true);
        done();
      });
  });

  it('should add user to room', (done) => {
    server.connection$.pipe(take(1))
      .subscribe(connection => {
        server.addToRoom('test-room', connection);
        const inRoom = server.rooms.get('test-room')?.has(connection.id);
        expect(inRoom).toBe(true);
        const notInRoom = server.rooms.get('other-room')?.has(connection.id);
        expect(notInRoom).toBeFalsy();
        done();
      })
  });

  it('should remove user from online users when connection closes', (done) => {
    setTimeout(() => client.close(), 100);
    server.close$.pipe(first()).subscribe(_ => {
      expect(server.onlineUsers.size).toBe(0);
      done();
    });
  });

  it('should remove user from room & close room', (done) => {
    server.connection$.pipe(take(1))
      .subscribe(connection => {
        server.addToRoom('test-room', connection);
        const added = server.rooms.get('test-room')?.has(connection.id);
        expect(added).toBe(true);
        server.removeFromRoom('test-room', connection);
        const room = server.rooms.get('test-room');
        expect(room).toBeFalsy();
        done();
      })
  });

  afterEach(() => client.close());
  afterAll(() => server.close());

});


