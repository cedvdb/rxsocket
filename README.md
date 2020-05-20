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

# Documentation

### Options
### Events
### Routing
### Custom http server

