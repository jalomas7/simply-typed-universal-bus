
export interface EventTypeMap {
    [event: string]: any;
}

export interface ListenerOptions {
    priority?: number;
}

export class EventBus<T extends EventTypeMap> {
    private listeners: {
        [K in keyof T]?: Array<ListenerOptions & { listener: (payload: T[K]) => void | Promise<void> }>;
    } = {};

    // Subscribe to an event.
    on<K extends keyof T>(event: K, listener: (payload: T[K]) => void, options?: ListenerOptions): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event]!.push({ listener, priority: options?.priority });

        // Sort ascending, higher number == higher priority
        this.listeners[event].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
    }

    // Unsubscribe from an event.
    off<K extends keyof T>(event: K, listener: (payload: T[K]) => void): void {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event]!.filter(({ listener: l }) => l !== listener);
    }

    // Emit an event with the proper payload.
    emit<K extends keyof T>(event: K, payload: T[K]): void {
        if (this.listeners[event]) {
            for (const { listener } of this.listeners[event]!) {
                listener(payload);
            }
        }
    }

    // Emit an event and listen asynchronously
    async emitAsync<K extends keyof T>(event: K, payload: T[K]): Promise<void> {
        if (this.listeners[event]) {
            await Promise.all(this.listeners[event].map(({ listener }) => listener(payload)));
        }
    }

    removeAllListenersForEvent<K extends keyof T>(event: K): void {
        this.listeners[event] = [];
    }

    removeAllListeners(): void {
        this.listeners = {};
    }

}
