const asyncMock = (time, shouldResolve = true, fn = () => {}) => new Promise((resolve, reject) => setTimeout(() => {
    fn();
    return shouldResolve ? resolve() : reject();
}, time));

export const oneSecondResolveFunction = (fn) => () => asyncMock(1000, true, fn);
export const twoSecondResolveFunction = (fn) => () => asyncMock(2000, true, fn);
export const oneSecondRejectFunction = () => () => asyncMock(1000, false);
export const twoSecondRejectFunction = () => () => asyncMock(2000, false);
