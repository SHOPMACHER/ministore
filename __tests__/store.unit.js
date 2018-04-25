import createStore from '../src';

describe('store class', () => {

    test('store creator does not throw', () => {
        expect(() => createStore()).not.toThrow();
    });

});
