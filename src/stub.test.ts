import { EventBus } from "./stub";

interface TestEvents {
    data: string;
}

describe('EventBus', () => {
    const testBus = new EventBus<TestEvents>();

    beforeEach(() => {
        testBus.removeAllListeners();
    });

    it('Should invoke listener when event is emitted', () => {
        const listener = jest.fn();
        testBus.on('data', listener);

        testBus.emit('data', 'test');

        expect(listener).toHaveBeenCalledWith('test');
    });
});