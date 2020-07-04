import * as R from "ramda"

import counterModel from "Examples/ui-kit/Counter/model"
import searchBarModel from "Examples/ui-kit/SearchBar/model"

import { addReducer, addBridge, merge, addLifecycle } from "./decorators"

import {
    GLOBAL_UPDATE,
    DEFAULT_INSTANCE_ID,
    GLOBAL_CONTEXT_ID,
} from "./constants"

describe("## Redux-MVC decorators", () => {
    describe("### addReducer", () => {
        it("Should create the reducer", () => {
            const module = addReducer()(counterModel)

            expect(typeof module.reducer).toBe("function")
        })

        it("Should return the ini state", () => {
            const module = addReducer()(counterModel)

            const iniState = module.reducer(undefined, {})

            expect(iniState).toBe(module.iniState)
        })

        it("Should execute the right reducer", () => {
            const module = addReducer()(counterModel)

            const nextState = module.reducer(
                module.iniState,
                module.actions.setCount(1)
            )

            expect(nextState[module.namespace][DEFAULT_INSTANCE_ID]).toEqual({
                count: 1,
            })
        })

        it("Should execute the right reducer and instance", () => {
            const module = addReducer()(counterModel)

            const nextState = module.reducer(
                module.iniState,
                module.actions.setCount(1, { meta: { instanceId: "counter" } })
            )

            expect(nextState[module.namespace].counter).toEqual({
                count: 1,
            })
        })

        it("Should return the previous state if the `action.type` handler is not found", () => {
            const module = addReducer()(counterModel)

            const prevState = {}
            const nextState = module.reducer(prevState, { type: "fake" })

            expect(nextState).toBe(prevState)
        })

        it("Should ignore the instanceId if the model is a singleton", () => {
            const module = addReducer()(searchBarModel)

            const nextState = module.reducer(
                module.iniState,
                searchBarModel.actions.setSearch("hola", {
                    meta: { instanceId: "searchBar" },
                })
            )

            expect(nextState[module.namespace][DEFAULT_INSTANCE_ID]).toEqual({
                search: "hola",
            })
        })

        it("Should merge the global updated state", () => {
            const module = addReducer()(searchBarModel)

            const nextState = module.reducer(module.iniState, {
                type: "action",
                payload: { newUser: "user" },
                meta: { [GLOBAL_UPDATE]: { user: "user" } },
            })

            expect(nextState.user).toBe("user")
        })
        it("Should return the old state instance if the reducer is the identity", () => {
            const module = addReducer()(searchBarModel)

            const nextState = module.reducer(
                module.iniState,
                module.actions.identity()
            )

            expect(nextState).toEqual(module.iniState)
        })
    })

    describe("### addBridge", () => {
        it("Should track all `module.dependencies` trackGlobalNamespaces and append the `trackGlobalNamespaces` param", () => {
            const mockModel = {
                dependencies: {
                    searchBar: { trackGlobalNamespaces: ["App", "Routing"] },
                    miniItemsSelector: {
                        trackGlobalNamespaces: ["Event", "Routing"],
                    },
                },
                namespace: "FakeModel",
            }
            const module = addBridge({
                trackGlobalNamespaces: ["App", "User"],
            })(mockModel)

            expect(module.trackGlobalNamespaces.length).toEqual(4)
            expect(module.trackGlobalNamespaces).toEqual(
                expect.arrayContaining(["App", "User", "Routing", "Event"])
            )
        })

        it("Should track all `module.dependencies` trackGlobalNamespaces", () => {
            const mockModel = {
                dependencies: {
                    searchBar: { trackGlobalNamespaces: ["App", "Routing"] },
                    miniItemsSelector: {
                        trackGlobalNamespaces: ["Event", "Routing"],
                    },
                },
                namespace: "FakeModel",
            }
            const module = addBridge()(mockModel)

            expect(module.trackGlobalNamespaces.length).toEqual(3)
            expect(module.trackGlobalNamespaces).toEqual(
                expect.arrayContaining(["App", "Routing", "Event"])
            )
        })

        it("Should set the `dispatchToGlobal` function", () => {
            const dispatchToGlobal = () => {}
            const module = addBridge({
                dispatchToGlobal,
            })(searchBarModel)

            expect(module).toEqual(
                expect.objectContaining({
                    dispatchToGlobal,
                })
            )
        })

        it("Should set the default `dispatchToGlobal` function when `dispatchToGlobal` param is empty", () => {
            const mockModel = {
                dependencies: {
                    searchBar: { namespace: "SearchBar" },
                    miniItemsSelector: { namespace: "MiniItemsSelector" },
                },
                namespace: "FakeModel",
            }
            const module = addBridge()(mockModel)

            expect(module).toEqual(
                expect.objectContaining({
                    dispatchToGlobal: expect.any(Function),
                })
            )
            const defaultDispatchToGlobal = module.dispatchToGlobal

            expect(
                defaultDispatchToGlobal({ type: "SearchBar/create" })
            ).toEqual(false)
            expect(
                defaultDispatchToGlobal({ type: "MiniItemsSelector/setName" })
            ).toEqual(false)
            expect(defaultDispatchToGlobal({ type: "FakeModel/init" })).toEqual(
                false
            )
            expect(defaultDispatchToGlobal({ type: "App/commit" })).toEqual(
                true
            )
        })

        it("Should set the default `dispatchToGlobal` even if module dependencies is empty", () => {
            const mockModel = {
                namespace: "FakeModel",
            }
            const module = addBridge()(mockModel)

            expect(module).toEqual(
                expect.objectContaining({
                    dispatchToGlobal: expect.any(Function),
                })
            )
            const defaultDispatchToGlobal = module.dispatchToGlobal

            expect(defaultDispatchToGlobal({ type: "FakeModel/init" })).toEqual(
                false
            )
            expect(defaultDispatchToGlobal({ type: "App/commit" })).toEqual(
                true
            )
        })
    })

    describe("### merge", () => {
        it("Should merge two modules", () => {
            const left = {
                namespace: "left",
                actions: "left",
                getters: "left",
                reducers: { left: "" },
                iniState: { left: "" },
                reducer: "left",
                dependencies: {
                    Counter: counterModel,
                },
                constructor: "left",
                componentDidCatch: "left",
                componentWillUnmount: "left",
                singleton: true,
                other: "left",
            }
            const right = {
                reducers: { right: "" },
                iniState: { right: "" },
                dependencies: {
                    SearchBar: searchBarModel,
                },
            }
            const module = merge(left)(right)

            expect(module).toEqual(
                expect.objectContaining({
                    ...right,
                    dependencies: {
                        ...left.dependencies,
                        ...right.dependencies,
                        [left.namespace]: left,
                    },
                })
            )
            expect(module).toEqual(expect.not.objectContaining(left))
        })

        it("Should merge two modules with no dependencies", () => {
            const module = merge(searchBarModel)(counterModel)

            expect(module).toEqual(
                expect.objectContaining({
                    ...counterModel,
                    dependencies: {
                        [searchBarModel.namespace]: searchBarModel,
                    },
                })
            )
        })
    })

    describe("### addLifecycle", () => {
        it("Should add `constructor` and `componentWillUnmount` to the module", () => {
            const newModule = R.compose(
                addLifecycle(),
                addReducer()
            )(counterModel)

            expect(newModule).toEqual(
                expect.objectContaining({
                    constructor: expect.any(Function),
                    componentWillUnmount: expect.any(Function),
                })
            )
        })

        it("Should create the store", () => {
            const newModule = R.compose(
                addLifecycle(),
                addReducer()
            )(counterModel)

            const contextId = "fakeContextId"
            const moduleInstances = { [contextId]: { ...newModule } }
            const moduleInstance = newModule.constructor({
                moduleInstances,
                contextId,
            })

            expect(moduleInstance.store).toEqual(
                expect.objectContaining({
                    getState: expect.any(Function),
                    subscribe: expect.any(Function),
                    dispatch: expect.any(Function),
                })
            )

            moduleInstance.store.dispatch(newModule.actions.add())
            expect(
                newModule.getters.count(moduleInstance.store.getState())
            ).toEqual(1)
            moduleInstance.store.dispatch(
                newModule.actions.add(null, {
                    meta: { instanceId: "fakeInstance" },
                })
            )
            expect(
                newModule.getters.count(moduleInstance.store.getState(), {
                    instanceId: "fakeInstance",
                })
            ).toEqual(1)
        })

        it("Should persist the store by default", () => {
            const newModule = R.compose(
                addLifecycle(),
                addReducer()
            )(counterModel)

            const contextId = "fakeContextId"
            const moduleInstances = { [contextId]: { ...newModule } }
            const moduleInstance = newModule.constructor({
                moduleInstances,
                contextId,
            })

            const newModuleInstance = newModule.constructor({
                moduleInstances,
                contextId,
            })

            expect(moduleInstance.store.getState()).toEqual(
                newModuleInstance.store.getState()
            )
        })

        it("Should dispatch to the global instance and track the result", () => {
            const searchBarModule = R.compose(
                addLifecycle(),
                addReducer()
            )(searchBarModel)

            const counterModule = R.compose(
                addLifecycle(),
                addReducer(),
                addBridge({
                    trackGlobalNamespaces: [searchBarModule.namespace],
                })
            )(counterModel)

            const contextId = "fakeContextId"
            const moduleInstances = {
                [contextId]: { ...counterModule },
                [GLOBAL_CONTEXT_ID]: { ...searchBarModule },
            }
            const globalInstance = searchBarModule.constructor({
                moduleInstances,
                contextId: GLOBAL_CONTEXT_ID,
            })

            moduleInstances[GLOBAL_CONTEXT_ID] = globalInstance

            const moduleInstance = counterModule.constructor({
                moduleInstances,
                contextId,
            })

            moduleInstance.store.dispatch(
                searchBarModule.actions.setSearch("hola")
            )
            expect(
                searchBarModule.getters.search(globalInstance.store.getState())
            ).toEqual("hola")
            expect(
                searchBarModule.getters.search(moduleInstance.store.getState())
            ).toEqual("hola")
        })

        it("Should unbind the bridge on `componentWillUnmount`", () => {
            const searchBarModule = R.compose(
                addLifecycle(),
                addReducer()
            )(searchBarModel)

            const counterModule = R.compose(
                addLifecycle(),
                addReducer(),
                addBridge({
                    trackGlobalNamespaces: [searchBarModule.namespace],
                })
            )(counterModel)

            const contextId = "fakeContextId"
            const moduleInstances = {
                [contextId]: { ...counterModule },
                [GLOBAL_CONTEXT_ID]: { ...searchBarModule },
            }
            const globalInstance = searchBarModule.constructor({
                moduleInstances,
                contextId: GLOBAL_CONTEXT_ID,
            })

            moduleInstances[GLOBAL_CONTEXT_ID] = globalInstance

            const moduleInstance = counterModule.constructor({
                moduleInstances,
                contextId,
            })

            moduleInstances[contextId] = moduleInstance

            moduleInstance.store.dispatch(
                searchBarModule.actions.setSearch("hola")
            )

            counterModule.componentWillUnmount({ moduleInstances, contextId })

            moduleInstance.store.dispatch(
                searchBarModule.actions.setSearch("chau")
            )
            expect(
                searchBarModule.getters.search(globalInstance.store.getState())
            ).toEqual("hola")
            expect(
                searchBarModule.getters.search(moduleInstance.store.getState())
            ).toEqual("hola")
        })
    })
})
