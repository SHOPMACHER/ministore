// @flow
import type { TStore, TListener, TAction } from './types';

import { actionErrors, listenerErrors } from './errors';

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
            throw new TypeError(actionErrors.NOT_STRING);
        }

        if (typeof listener !== 'object') {
            throw new TypeError(listenerErrors.NOT_OBJECT);
        }

        if (typeof listener.handler !== 'function') {
            throw new TypeError(listenerErrors.NOT_FUNCTION);
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
            throw new TypeError(actionErrors.NOT_OBJECT);
        }

        if (!action.type) {
            throw new Error(actionErrors.NOT_SET);
        }

        if (!has.call(store, action.type)) {
            throw new Error(actionErrors.NOT_FOUND);
        }

        const payload = action.payload ? action.payload : {};

        return _execute(store[action.type], payload);
    };

    const unregister = (actionType: string) => {
        if (typeof actionType !== 'string') {
            throw new TypeError(actionErrors.NOT_STRING);
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
