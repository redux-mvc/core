/* eslint-disable no-unused-vars */

export const ModelInterface = {
    namespace: "",
    iniState: {},
    reducers: {},
    singleton: false,
}

export const moduleInterface = {
    ...ModelInterface,
    modules: {},
    middleware: {},
    observedDomains: [],
    reducer(state, action) {},
    createStore({ bridgeMiddleware }) {},
    dispatchToGlobal(action) {},
    on(event, handler) {},
    emit(event, ...params) {},
}
