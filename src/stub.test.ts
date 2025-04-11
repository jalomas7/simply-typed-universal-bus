import { EventBus } from "./stub";

interface TestEvents {
    data: string;
    test: string;
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

    it('Should not invoke a listener for a separate event', () => {
        const listener = jest.fn();
        testBus.on('data', listener);

        testBus.emit('test', 'testing');
        expect(listener).not.toHaveBeenCalled();
    });

    it('should be able to remove listeners', () => {
        const listener = jest.fn();
        testBus.on('data', listener);
        testBus.emit('data', 'test');
        testBus.off('data', listener);
        testBus.emit('data', 'test');
        expect(listener).toHaveBeenCalledTimes(1);
    });

    it('Should invoke listeners in order of priority', () => {
        const listener1 = jest.fn();
        const listener2 = jest.fn();

        testBus.on('data', listener1);
        testBus.on('data', listener2, { priority: 5 });

        testBus.emit('data', 'test');

        expect(listener2).toHaveBeenCalledBefore(listener1);
    });

    it('Should invoke async listeners', async () => {
        const listener = jest.fn(async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
        });

        testBus.on('data', listener);

        await testBus.emitAsync('data', 'test');

        expect(listener).toHaveBeenCalledWith('test');
    });

    it('Should remove all listeners for an event', () => {
        const listener1 = jest.fn();
        const listener2 = jest.fn();

        testBus.on('data', listener1);
        testBus.on('data', listener2);

        testBus.removeAllListenersForEvent('data');

        testBus.emit('data', 'test');

        expect(listener1).not.toHaveBeenCalled();
        expect(listener2).not.toHaveBeenCalled();
    });

    it('Should remove all listeners', () => {
        const listener1 = jest.fn();
        const listener2 = jest.fn();

        testBus.on('data', listener1);
        testBus.on('test', listener2);

        testBus.removeAllListeners();

        testBus.emit('data', 'test');
        testBus.emit('test', 'test');

        expect(listener1).not.toHaveBeenCalled();
        expect(listener2).not.toHaveBeenCalled();
    });

    it('should not throw when emitting an event', () => {
        const listener = jest.fn(() => { throw new Error('test'); });
        testBus.on('data', listener);

        expect(async () => {
            testBus.emit('data', 'test');
            await testBus.emitAsync('data', 'test');
        }).not.toThrow();
    });

    it('should throw when abortAllOnError is true', () => {
        const listener = jest.fn(() => { throw new Error('test error'); });
        const listener2 = jest.fn();
        testBus.on('data', listener, { abortAllOnError: true });
        testBus.on('data', listener2);

        expect(() => {
            testBus.emit('data', 'test');
        }).toThrow();

        expect(async () => {
            await testBus.emitAsync('data', 'test');
        }).rejects.toThrow();

        expect(listener2).not.toHaveBeenCalled();
    });

    it('should call global error handler', () => {
        const listener = jest.fn(() => { throw new Error('test'); });
        const globalErrorHandler = jest.fn();

        testBus.setErrorHandler(globalErrorHandler);
        testBus.on('data', listener);

        testBus.emit('data', 'test');

        expect(globalErrorHandler).toHaveBeenCalled();
    });

    it('should return errors from emit', () => {
        const listener = jest.fn(() => { throw new Error('test'); });
        const listener2 = jest.fn(() => { throw new Error('test2'); });
        testBus.on('data', listener);
        testBus.on('data', listener2);
        const errors = testBus.emit('data', 'test');
        expect(errors).toHaveLength(2);
        expect(errors[0].message).toBe('test');
        expect(errors[1].message).toBe('test2');
    });

    it('should invoke onError callback on error', () => {
        const listener = jest.fn(() => { throw new Error('test'); });
        const onError = jest.fn();
        testBus.on('data', listener, { onError });

        testBus.emit('data', 'test');

        expect(onError).toHaveBeenCalledWith(expect.any(Error), 'test');
    });

    it('should invoke onError callback even when abortAllOnError is true', () => {
        const listener = jest.fn(() => { throw new Error('test'); });
        const onError = jest.fn();
        testBus.on('data', listener, { onError, abortAllOnError: true });

        expect(() => {
            testBus.emit('data', 'test');
        }).toThrow();

        expect(onError).toHaveBeenCalledWith(expect.any(Error), 'test');
    });
});