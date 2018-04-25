import createStore from '../src';

describe('store register method', () => {

    let store;

    beforeEach(() => {
        store = createStore();
    });

    test('register method is exposed by store', () => {
        expect(typeof store.register).toBe('function');
    });

    test('register returns true when valid listener is passed', () => {
        const listener = {
            handler: () => {},
            priority: 1
        };

        const result = store.register('test', listener);

        expect(result).toBe(true);
    });

    test('register returns true when priority is omitted', () => {
        const listener = {
            handler: () => {}
        };

        const result = store.register('test', listener);

        expect(result).toBe(true);
    });

    test('register throws when no arguments are specified', () => {
        expect(() => store.register()).toThrow();
    });

    test('register throws when no listener name is specified', () => {
        const listener = {
            handler: () => {}
        };

        expect(() => store.register(listener)).toThrow();
    });

    test('register throws when no listener is specified', () => {
        expect(() => store.register('test')).toThrow();
    });

    test('register throws when handler is not a function', () => {
        const listener = {
            handler: 'test'
        };

        expect(() => store.register('test', listener)).toThrow();
    });

});
