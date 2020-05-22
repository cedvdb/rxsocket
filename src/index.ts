import { RxSocket as RxSocketClient } from './client';
import { RxSocket as RxSocketServer } from './server';

const RxSocket = {
  Client: RxSocketClient,
  Server: RxSocketServer
}

export default RxSocket;