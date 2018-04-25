export type TStore = {
    register: Function<void>,
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
