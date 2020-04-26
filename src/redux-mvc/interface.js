/* eslint-disable no-unused-vars */

export const ModelInterface = {
    namespace: "",
    iniState: {},
    reducers: {},
    singleton: false,
    dependencies: {},
}

export const ModuleInterface = {
    ...ModelInterface,
    middleware: {},
    observedDomains: [],
    reducer(state, action) {},
    createStore({ bridgeMiddleware }) {},
    dispatchToGlobal(action) {},
    on(event, handler) {},
    emit(event, ...params) {},
}
