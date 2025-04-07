import { EventBus } from '../stub.js';

interface MyEvents {
    data: string;
}

const bus = new EventBus<MyEvents>();

bus.on('data', () => {
    throw new Error('simulated error');
});

bus.on('data', (payload) => {
    console.log(`Received data: ${payload}`);
});

const errorHandler = (error: Error, event: keyof MyEvents, payload: MyEvents[keyof MyEvents]) => {
    console.error(`Error occurred in event "${event}": ${error.message}`);
    console.error(`Payload: ${JSON.stringify(payload)}`);
}
bus.setErrorHandler(errorHandler);

bus.emit('data', 'Hello, world!');