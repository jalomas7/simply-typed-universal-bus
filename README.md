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

The order in which listeners are invoked can be constrolled with the `priority` listener option. The higher the priority, the sooner the listener is evoked during `emit`. 

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