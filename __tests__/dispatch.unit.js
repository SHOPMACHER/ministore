import createStore from '../src';

describe('store dispatch method', () => {

    let store;

    beforeEach(() => {
        store = createStore();
    });

    test('dispatch method is exposed by store', () => {
        expect(typeof store.dispatch).toBe('function');
    });

    test('dispatch throws when no listener is registered', () => {
        const action = {
            type: 'test',
            payload: {}
        };

        expect(() => store.dispatch(action)).toThrow();
    });

    test('dispatch throws when no action is passed', () => {
        expect(() => store.dispatch()).toThrow();
    });

});
