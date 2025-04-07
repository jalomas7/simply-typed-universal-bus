import { EventBus } from "../stub.js";

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