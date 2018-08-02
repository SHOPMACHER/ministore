export type TStore = {
    register: Function<void>,
    unregister: Function<void>,
    dispatch: Function<void>
};

export type TListener = {
    handler: Function,
    priority?: number
};

export type TAction = {
    type: string,
    payload?: Object
};

export type TStateHandler = Function<void>;
