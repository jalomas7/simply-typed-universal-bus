import { EventBus } from "../stub.js";

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