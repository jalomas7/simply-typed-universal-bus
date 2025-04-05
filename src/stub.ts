
export interface EventTypeMap {
    [event: string]: any;
}

export class EventBus<T extends EventTypeMap> {
    private listeners: {
        [K in keyof T]?: Array<(payload: T[K]) => void>;
    } = {};

    // Subscribe to an event.
    on<K extends keyof T>(event: K, listener: (payload: T[K]) => void): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event]!.push(listener);
    }

    // Unsubscribe from an event.
    off<K extends keyof T>(event: K, listener: (payload: T[K]) => void): void {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event]!.filter(l => l !== listener);
    }

    // Emit an event with the proper payload.
    emit<K extends keyof T>(event: K, payload: T[K]): void {
        if (this.listeners[event]) {
            for (const listener of this.listeners[event]!) {
                listener(payload);
            }
        }
    }
}
