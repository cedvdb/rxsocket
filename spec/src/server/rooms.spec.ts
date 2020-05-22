

import { delay, first, take } from 'rxjs/operators';
import { RxSocket as RxSocketClient } from '../../../client';
import { createClient, server } from '../server-client';

describe('Rx Socket Server - rooms', () => {

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
    let size: number;
    setTimeout(() => {
      size = server.onlineUsers.size;
      client.close();
    }, 100);
    server.close$.pipe(first()).subscribe(_ => {
      expect(server.onlineUsers.size).toBe(size - 1);
      done();
    });
  });

  it('should remove user from room & close room', (done) => {
    server.connection$.pipe(take(1), delay(100))
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


