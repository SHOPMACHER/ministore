// @flow
import type { TStore, TListener, TAction, TState, TStateHandler } from './types';

import { actionErrors, listenerErrors, stateErrors } from './errors';

const has = Object.prototype.hasOwnProperty;

/**
 * Represents the store with the function to register, unregister and dispatch the actions
 *
 * @returns {{register: function(string, TListener): boolean, unregister: function(string): boolean, dispatch: function(TAction): *}}
 */
function createStore(): TStore {
    const store = Object.create(null);

    let currentState =null;

    let onChangeHandler = () => {};

    /**
     * Executes handler promises
     *
     * @param {Array} listener Array of listener
     * @param {Object} payload Payload Object for all handlers of the action
     * @param {number} counter The count of handler iteration
     * @returns {Promise} Returns the promise resolved
     * @private
     */
    function _execute(listener: Array, payload: Object, counter: number = 0) {
        if (listener.length === counter) {
            return Promise.resolve();
        }

        return listener[counter].handler(payload).then(() => {
            return _execute(listener, payload, counter + 1);
        }).catch(() => _execute(listener, payload, counter + 1));
    }

    /**
     * Registers the action
     *
     * @param {string} actionType The name of the action
     * @param {Object} listener The listener object
     * @returns {boolean} Returns true if action is registered
     */
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

        store[actionType] = !has.call(store, actionType) ? [listener] : store[actionType].concat(listener);

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

    /**
     * Dispatches the action
     *
     * @param {Object} action The action object for dispatching the type
     * @returns {Promise} Returns the handler Promise resolved
     */
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

        const payload = action.payload || {};

        return _execute(store[action.type], payload);
    };

    /**
     * Unregisters the action
     *
     * @param {string} actionType The action type to delete from store
     * @returns {boolean} Returns true if the action type is deleted
     */
    const unregister = (actionType: string) => {
        if (typeof actionType !== 'string') {
            throw new TypeError(actionErrors.NOT_STRING);
        }

        if (has.call(store, actionType)) {
            delete store[actionType];
        }

        return true;
    };

    /**
     * Sets the on change handler function
     *
     * @param {function|Object} initialState
     * @param {function} handler
     * @returns {boolean}
     */
    function registerState(initialState: TState, handler: TStateHandler) {
        if (typeof initialState !== 'object') {
            throw new Error(stateErrors.NOT_OBJECT);
        }

        currentState = initialState;

        if (typeof handler === 'function') {
            onChangeHandler = handler;
        } else {
            return false;
        }

        return true;
    }

    function setState(nextState: TState) {
        const prevState = {...currentState};

        switch (typeof nextState) {
            case 'object':
                currentState = {
                    ...currentState,
                    ...nextState
                };
                break;
            default:
                throw new Error(stateErrors.NOT_OBJECT);
        }

        if (typeof handler === 'function') {
            onChangeHandler(prevState);
        }

        return true;
    }

    function getState() {
        return currentState;
    }

    return {
        register,
        unregister,
        dispatch,
        registerState,
        setState,
        getState
    };
}

module.exports = createStore;
