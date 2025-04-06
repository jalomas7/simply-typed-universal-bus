import { EventBus } from '../stub';

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
