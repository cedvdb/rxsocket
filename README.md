# AR Socket

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
import RxSocket from 'rxsocket/server';

const socket = new RxSocket({ port: 3000 });

socket.select('GET_TIME')
  .subscribe(({ dispatch }) => {
    // will send the time to the client every ~1 second
    setInterval(() => dispatch({ type: 'TIME', payload: Date.now() }), 1000);
  });
```


### 2. Creating the client

```javascript
import RxSocket from 'rxsocket/client';

const socket = new RxSocket({ url: 'ws://localhost:3000' });

socket.select('TIME')
  .subscribe(({ payload, dispatch }) => {
    console.log(payload);
  });

socket.dispatch({ type: 'GET_TIME' })
```

### Angular example:

```javascript 
export class AppComponent implements OnInit {
  messages$: Observable<any> = rxSocket.select('MESSAGES').pipe(
    map((action) => action.payload)
  );

  ngOnInit() {
    rxSocket.dispatch({ type: 'GET_MESSAGES' });
  }

  post(content: string) {
    const message = { content };
    rxSocket.dispatch({ type: 'POST_MESSAGES', payload: message });
  }
}
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

RxSocket is based on ws, so everything that's valid on websocket/ws is valid here: (https://github.com/websockets/ws)

Every option that is specific for rxSocket is under the rxSocket key

for example:

```
  const rxSocket = new RxSocket({ rxSocket: { logLevel: LogLevel.DEBUG }});
```

### Custom http server

Same as for websocket/ws (read options paragraph for more info).
