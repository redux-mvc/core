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
    reducer(state, action) {},
    trackGlobalNamespaces: [],
    dispatchToGlobal() {},
    constructor() {},
    componentDidCatch() {},
    componentDidMount() {},
    componentWillUnmount() {},
}
