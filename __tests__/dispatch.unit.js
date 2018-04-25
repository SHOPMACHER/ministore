import createStore from '../src';

describe('store dispatch method', () => {

    let store;

    beforeEach(() => {
        store = createStore();
    });

    test('dispatch method is exposed by store', () => {
        expect(typeof store.dispatch).toBe('function');
    });

    test('dispatch does not throw when no listener is registered', () => {
        const action = {
            type: 'test',
            payload: {}
        };

        expect(() => store.dispatch(action)).not.toThrow();
    });

    test('dispatch returns Promise even when no listener is registered', () => {
        const action = {
            type: 'test',
            payload: {}
        };

        const result = store.dispatch(action);

        expect(result instanceof Promise).toBe(true);
    });

    test('dispatch throws when no action is passed', () => {
        expect(() => store.dispatch()).toThrow();
    });

});
