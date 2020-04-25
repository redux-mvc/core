/* eslint-disable no-unused-vars */

export const ModelInterface = {
    namespace: "",
    iniState: {},
    reducers: {},
    singleton: false,
}

export const ModuleInterface = {
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
