/* eslint-disable no-unused-vars */

export const ModelDefinitionInterface = {
    namespace: "",
    iniState: {},
    reducers: {},
    singleton: false,
}

export const ModelInterface = {
    ...ModelDefinitionInterface,
    actions: {},
    getters: {},
}

export const ModuleInterface = {
    ...ModelInterface,
    reducer(state, action) {},
    dependencies: {},
    middleware: {},
    trackGlobalNamespaces: [],
    dispatchToGlobal() {},
    constructor() {},
    componentDidCatch() {},
    componentDidMount() {},
    componentWillUnmount() {},
}
