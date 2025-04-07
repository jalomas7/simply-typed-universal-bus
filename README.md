# Simply Typed Universal Bus (STUB)

STUB is a simple, typed event bus written in Typescript. 

## Installation

`npm install simply-typed-universal-bus`

## Usage

```ts
import { EventBus } from 'simply-typed-universal-bus';

// Define the events and payload types.
interface MyEvents {
    data: { id: number; value: string };
    error: Error;
}

// Instantiate the event bus with the specific event types.
const bus = new EventBus<MyEvents>();

// Register a listener for the 'data' event.
bus.on('data', (payload) => {
    console.log(`Received data: ${payload.id}, ${payload.value}`);
});

// Emit a 'data' event.
bus.emit('data', { id: 1, value: 'Hello, world!' });

// Try registering and emitting an 'error' event.
bus.on('error', (err) => {
    console.error(`Error event: ${err.message}`);
});

bus.emit('error', new Error('Something went wrong'));
```

### Asynchronous listeners

```ts
import { EventBus } from "simply-typed-universal-bus";

interface MyEvents {
    data: { id: number, value: string };
}

const bus = new EventBus<MyEvents>();

bus.on('data', async (payload) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Received async data, id: ${payload.id}, value: ${payload.value}`);
});

// emit asynchronously
(async () => {
    console.log(`Emitting asynchronously`);
    await bus.emitAsync('data', { id: 1, value: 'Hello World' });
    console.log('Complete');
})();
```

### Listener prioritization

The order in which listeners are invoked can be controlled with the `priority` listener option. The higher the priority, the sooner the listener is evoked during `emit`. 

```ts
import { EventBus } from "simply-typed-universal-bus";

interface MyEvents {
    data: string;
}

const bus = new EventBus<MyEvents>();

bus.on('data', () => {
    console.log('I was registered first!');
})

bus.on('data', () => {
    console.log('I am higher priority!');
}, { priority: 5 });

// prints 'I am higher priority!' then 'I was registered first!'
bus.emit('data', 'testing priority');
```

### Removing listeners

There are three methods for removing listeners. Use `off` to remove a single listener. Give a reference to the listener to remove it. Use `removeAllListenersForEvent` to remove all listeners for a particular event.
Use `removeAllListeners` to remove all listeners from all events.

## Error handling

Errors can be handled in one of two ways; either through a global error handler that is applied to every error encountered during `emit` or `emitAsync`, or by checking the return values of `emit` or `emitAsync`. 

### Global error handling

```ts
    import { EventBus } from 'simply-typed-universal-bus';

    interface MyEvents {
        data: string;
    }

    const bus = new EventBus<MyEvents>();

    bus.on('data', () => {
        throw new Error('simulated error');
    });

    const errorHandler = (error: Error, event: keyof MyEvents, payload: MyEvents[keyof MyEvents]) => {
        console.error(`Error occurred in event "${event}": ${error.message}`);
        console.error(`Payload: ${JSON.stringify(payload)}`);
    }
    bus.setErrorHandler(errorHandler);

    // prints out:
    // Error occurred in event "data": simulated error
    // Payload: "Hello, world!"
    bus.emit('data', 'Hello, world!');
```

### Error handling through return value

```ts
    import { EventBus } from 'simply-typed-universal-bus';

    interface MyEvents {
        data: string;
    }

    const bus = new EventBus<MyEvents>(); 

    bus.on('data', () => {
        throw new Error('error1');
    });
   
    bus.on('data', () => {
        throw new Error('error2');
    });

    const errors = bus.emit('data', 'hello world');

    for(error in errors) {
        console.log(`Received error: ${error.message}`);
    }
```
### Abort listeners on error

You also have the option to halt listeners during `emit` by using the `abortAllOnError` listener option. When this option is enabled and an error is encountered during the invocation of the listener, the error is thrown back to the `emit` caller. Note the global error handler is still called when this option is enabled. 

```ts
import { EventBus } from "simply-typed-universal-bus";

interface MyEvents {
    data: string;
}
const bus = new EventBus<MyEvents>();

bus.on('data', () => {
    console.log('I was registered first!');
    throw new Error('I am an error!');
}, { abortAllOnError: true });

bus.on('data', () => {
    console.log('I was registered second!');
});

// prints 'I was registered first!' then throws an error
try {
    bus.emit('data', 'testing abortAllOnError');
}
catch (error) {
    console.error(`Caught an error: ${(error as Error).message}`);
}
```
