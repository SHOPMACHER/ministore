import * as asyncMocks from '../__mocks__/async';

import createStore from '../src';

describe('store integration', () => {

    describe('basic dispatches', () => {

        let store;

        beforeAll(() => {
            jest.useFakeTimers();
        });

        beforeEach(() => {
            store = createStore();
            store.register('test', {
                handler: asyncMocks.oneSecondResolveFunction()
            });
        });

        test('handler has been called once after dispatch', () => {
            store.dispatch({ type: 'test' });
            expect(setTimeout).toHaveBeenCalledTimes(1);
        });

        test('handler has been called 1000ms after dispatch', () => {
            store.dispatch({ type: 'test' });
            expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);
        });

    });

    describe('multiple listeners without priority', () => {

        let store;

        beforeAll(() => {
            jest.useRealTimers();
        });

        beforeEach(() => {
            store = createStore();
        });

        test('listeners get called in the correct order', async () => {
            const result = [];

            store.register('test', {
                handler: asyncMocks.twoSecondResolveFunction(() => result.push(1))
            });
            store.register('test', {
                handler: asyncMocks.oneSecondResolveFunction(() => result.push(2))
            });

            await store.dispatch({ type: 'test' });
            expect(result).toEqual([1, 2]);
        });

        test('listener chain are not interrupted by rejected handler', async () => {
            const result = [];

            store.register('test', {
                handler: asyncMocks.oneSecondRejectFunction()
            });
            store.register('test', {
                handler: asyncMocks.oneSecondResolveFunction(() => result.push(2))
            });

            await store.dispatch({ type: 'test' });
            expect(result).toEqual([2]);
        });

    });

    describe('multiple listeners with priority', () => {

        let store;

        beforeAll(() => {
            jest.useRealTimers();
        });

        beforeEach(() => {
            store = createStore();
        });

        test('listeners with highest priority gets called first', async () => {
            const result = [];

            store.register('test', {
                handler: asyncMocks.oneSecondResolveFunction(() => result.push(1)),
                priority: 1
            });
            store.register('test', {
                handler: asyncMocks.oneSecondResolveFunction(() => result.push(2)),
                priority: 2
            });

            await store.dispatch({ type: 'test' });
            expect(result).toEqual([2, 1]);
        });

        test('listeners with undefined priority gets called last', async () => {
            const result = [];

            store.register('test', {
                handler: asyncMocks.oneSecondResolveFunction(() => result.push(1))
            });
            store.register('test', {
                handler: asyncMocks.oneSecondResolveFunction(() => result.push(2)),
                priority: 2
            });

            await store.dispatch({ type: 'test' });
            expect(result).toEqual([2, 1]);
        });

    });

});
