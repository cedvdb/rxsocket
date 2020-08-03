# RX Socket

A dead easy reactive websocket framework.


# Table of Contents

 - [Features](#features)
 - [Architecture](#architecture)
 - [Examples](#example)
 - [Documentation](#documentation)

# Features

 - Very Simple API 
 - Reactive (data stream)
 - Action (redux) architecture
 - Symetric API on client and server
 - Broadcast
 - Room system
 - Tested

# Architecture


```javascript
    const action = { type: 'GET_MESSAGES', payload: { userId: 1 }};
```

 - Every message between the client and the server are called `Action`.
 - An `Action` has a `type` and a `payload`.
 - You `dispatch` an `Action`
 - You `select` an action `type` and react to it by dispatching another or a bunch of other actions. 



```javascript
  const socket = new RxSocket();
  socket.select('GET_MESSAGES')
    .subscribe(({ payload, dispatch }) => {
      const messages = getMessages(payload.userId)
      dispatch({ type: messages, payload: messages});
    });
```

That's it! If you understood the above you already understand the framework.


# Examples:


### 1. Creating the server:


```javascript
import { RxSocket } from '@cedvdb/rxsocket/server';

const socket = new RxSocket({ port: 3000 });

socket.select('GET_TIME')
  .subscribe(({ dispatch }) => {
    // will send the time to the client every ~1 second
    setInterval(() => dispatch({ type: 'TIME', payload: Date.now() }), 1000);
  });
```


### 2. Creating the client

```javascript
import { RxSocket } from '@cedvdb/rxsocket/client';

const socket = new RxSocket({ url: 'ws://localhost:3000' });

socket.select('TIME')
  .subscribe(({ payload, dispatch }) => {
    console.log(payload);
  });

socket.dispatch({ type: 'GET_TIME' })
```

# Documentation

### Routing

For routing incoming `Action` you can either use `select()` or `route()`. The only difference between those is
that with `route()` you do everything at once and a nicely formated table of the routes will be logged.

select example:

```javascript
  const respond = (action: ActionEvent) => action.dispatch({ type: 'other action' });
  server.select('A').subscribe(respond);
  server.select('B').subscribe(respond);
  server.select('C').subscribe(respond);
```


route example:

```javascript
  const respond = (action: ActionEvent) => action.dispatch({ type: 'other action' });
  server.route([
    { type: 'A', handler: respond },
    { type: 'B', handler: respond },
    { type: 'C', handler: respond },
  ]);
```

### Events

Each version of RxSocket (client and server) have observable attached on them so you can observe the lifecycle of 
a connection.

```javascript
  const rxSocket = new RxSocket();
  /** when client connects */
  rxSocket.connection$: Observable<Connection>;
  /** when an error occurs */
  rxSocket.error$: Observable<Error>;
  /** when a connection closes */
  rxSocket.close$: Observable<Connection>;
  /** action received */
  rxSocket.received$: Observable<ActionEvent>;
  /** action dispatched */
  rxSocket.dispatched$: Observable<Action>;
```

### Options

##### Client 

```javascript
export interface Options {
  /** url to which the websocket connects */
  url: string;
  /** specify the log level to only get message >= to this log level */
  logLevel?: LogLevel;
  /** when the client is started on node, it won't use the native websocket from the browser */
  node?: boolean;
}
```

Note: RxSocket architecture is agnostic in spirit. There are bridges for different websocket implementations When node is set to true, rxSocket uses the a bridge for the `WebSocket.Client` from the ws package, when false it uses the `NativeRxBridge` class that is just a bridge for native browser websocket.

The codebase anticipate the possibility of a need for switching websocket implementation and is built with that in mind. At the moment it's not part of the public API, so if there is a need for this, please drop a feature request on github.

##### Server

RxSocket is based on ws, so everything that's valid on websocket/ws is valid here: (https://github.com/websockets/ws)

Every option that is specific for rxSocket is under the rxSocket key

for example:

```
  const rxSocket = new RxSocket({ rxSocket: { logLevel: LogLevel.DEBUG }});
```


### Custom http server

Same as for websocket/ws (read options paragraph for more info).
