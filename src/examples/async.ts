import { EventBus } from "../stub.js";

interface MyEvents {
    data: { id: number, value: string };
}

const bus = new EventBus<MyEvents>();

// listen for 'data' event

bus.on('data', (payload) => {
    console.log(`Received id: ${payload.id}, value: ${payload.value}`);
});

bus.on('data', async (payload) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Received async data, id: ${payload.id}, value: ${payload.value}`);
});

// emit synchronously
console.log(`Emitting synchronously`);
bus.emit('data', { id: 1, value: 'Hello World' });
console.log('Complete');

// emit asynchronously
(async () => {

    // wait for synchronous emit to complete
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log(`Emitting asynchronously`);
    await bus.emitAsync('data', { id: 1, value: 'Hello World' });
    console.log('Complete');
})();