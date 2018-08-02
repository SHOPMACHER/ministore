import createStore from '../src';

describe('state integration', () => {

    describe('register initialState and handler', () => {

        let state;

        beforeEach(() => {
            state = createStore();
        });

        test('register throws when initialState is not a object or function', () => {
            const initialState = 'test';
            const handler = null;

            expect(() => state.registerState(initialState, handler)).toThrow();
        });

        test('register an onChangeHandler and returns false when invalid handler is passed', () => {
            const handler = 'test';
            const initialState = {};

            expect(state.registerState(initialState, handler)).toBe(false);
        });

        test('register an onChangeHandler and returns true when valid handler is passed', () => {
            const handler = () => {};
            const initialState = {};

            expect(state.registerState(initialState, handler)).toBe(true);
        });
    });

    describe('set initial state', () => {

        let state;

        beforeEach(() => {
            state = createStore();
        });

        test('set a state and returns true whene vailid params and data is passed', () => {
            const handler = () => {};
            const initialState = {};

            state.registerState(initialState, handler);

            const nextState = {
                test: 'test'
            };

            expect(state.setState(nextState)).toBe(true);
        });
    });

    describe('get state', () => {

        let state;

        beforeEach(() => {
            state = createStore();
        });

        test('get a state and returns true whene vailid params and data is passed', () => {
            const handler = () => {};
            const initialState = {};

            state.registerState(initialState, handler);

            const nextState = {
                test: 'test'
            };

            state.setState(nextState);

            expect(state.getState()).toEqual({ test: 'test' });
        });
    });
});
