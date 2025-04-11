export interface EventTypeMap {
    [event: string]: any;
}

export interface ListenerOptions {
    priority?: number;
    abortAllOnError?: boolean;
    onError?: (error: Error, payload: any) => void;
}

export class EventBus<T extends EventTypeMap> {
    private listeners: {
        [K in keyof T]?: Array<ListenerOptions & { listener: (payload: T[K]) => void | Promise<void> }>;
    } = {};

    private globalErrorHandler?: <K extends keyof T>(error: Error, event: K, payload: T[K]) => void;

    // Method to set a global error handler
    setErrorHandler(handler: <K extends keyof T>(error: Error, event: K, payload: T[K]) => void): void {
        this.globalErrorHandler = handler;
    }

    // Subscribe to an event.
    on<K extends keyof T>(event: K, listener: (payload: T[K]) => void, options?: ListenerOptions): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event]!.push({ listener, ...options });

        // Sort ascending, higher number == higher priority
        this.listeners[event].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
    }

    // Unsubscribe from an event.
    off<K extends keyof T>(event: K, listener: (payload: T[K]) => void): void {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event]!.filter(({ listener: l }) => l !== listener);
    }

    // Emit an event with the proper payload.
    emit<K extends keyof T>(event: K, payload: T[K]): Error[] {
        const errors: Error[] = [];
        if (!this.listeners[event]) {
            return errors;
        }

        for (const { listener, abortAllOnError, onError } of this.listeners[event]!) {
            try {
                listener(payload);
            } catch (error) {

                const err = error instanceof Error ? error : new Error(String(error));
                errors.push(err);
                if (this.globalErrorHandler) {
                    this.globalErrorHandler(err, event, payload);
                }

                if (onError) {
                    onError(err, payload);
                }

                if (abortAllOnError) {
                    throw error;
                }
            }
        }

        return errors;
    }

    // Emit an event and listen asynchronously
    async emitAsync<K extends keyof T>(event: K, payload: T[K]): Promise<Error[]> {
        const errors: Error[] = [];
        if (!this.listeners[event]) {
            return errors;
        }

        for (const { listener, abortAllOnError, onError } of this.listeners[event]!) {
            try {
                await listener(payload);
            } catch (error) {

                const err = error instanceof Error ? error : new Error(String(error));
                errors.push(err);

                if (this.globalErrorHandler) {
                    this.globalErrorHandler(err, event, payload);
                }

                if (onError) {
                    onError(err, payload);
                }

                if (abortAllOnError) {
                    throw error;
                }
            }
        }

        return errors;
    }

    removeAllListenersForEvent<K extends keyof T>(event: K): void {
        this.listeners[event] = [];
    }

    removeAllListeners(): void {
        this.listeners = {};
    }

}
