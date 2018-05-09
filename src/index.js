// @flow
import type { TStore, TListener, TAction } from './types';

const has = Object.prototype.hasOwnProperty;

function createStore(): TStore {
    const store = Object.create(null);

    function _execute(listener: Array, payload: Object = {}, counter: number = 0) {
        if (listener.length === counter) {
            return Promise.resolve();
        }

        return listener[counter].handler().then(() => {
            return _execute(listener, payload, counter + 1);
        }).catch(() => _execute(listener, payload, counter + 1));
    }

    const register = (actionType: string, listener: TListener) => {
        if (typeof actionType !== 'string') {
            throw new TypeError('Action Type is not a string');
        }

        if (typeof listener !== 'object') {
            throw new TypeError('No listener is set or is not a object');
        }

        if (typeof listener.handler !== 'function') {
            throw new TypeError('Handler is not a function');
        }

        if (!has.call(store, actionType)) {
            store[actionType] = [];
        }

        store[actionType].push(listener);

        if (store[actionType].length > 1) {
            store[actionType].sort((a, b) => {
                if (!a.priority && !b.priority) {
                    return 0;
                }

                if (!a.priority) {
                    return 1;
                }

                if (!b.priority) {
                    return -1;
                }

                return a.priority < b.priority ? 1 : -1;
            });
        }

        return true;
    };

    const dispatch = (action: TAction) => {
        if (typeof action !== 'object') {
            throw new TypeError('Action is not a object');
        }

        if (!action.type) {
            throw new Error('No Action-Type is set');
        }

        if (!has.call(store, action.type)) {
            throw new Error('Action-Type not found in store');
        }

        const payload = action.payload ? action.payload : {};

        return _execute(store[action.type], payload);
    };

    const unregister = (actionType: string) => {
        if (!actionType || typeof actionType !== 'string') {
            throw new TypeError('Action Type is not a string');
        }

        if (has.call(store, actionType)) {
            delete store[actionType];
        }

        return true;
    };

    return {
        register,
        unregister,
        dispatch
    };
}

module.exports = createStore;
