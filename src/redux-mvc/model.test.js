import { createModel } from "./model"

import { DEFAULT_INSTANCE_ID } from "./constants"

describe("## createModel", () => {
    it("Should take a model definition and return a model", () => {
        const model = createModel({
            namespace: "Counter",
        })

        expect(model).toEqual(
            expect.objectContaining({
                namespace: "Counter",
                iniState: { Counter: { [DEFAULT_INSTANCE_ID]: {} } },
                reducers: expect.any(Object),
                getters: expect.any(Object),
                actions: expect.any(Object),
                singleton: false,
            })
        )
    })

    describe("### getters", () => {
        it("Should return one getter per iniState key", () => {
            const model = createModel({
                namespace: "Counter",
                iniState: {
                    count: 0,
                    search: null,
                },
            })

            expect(model.getters.count).toEqual(expect.any(Function))
            expect(model.getters.search).toEqual(expect.any(Function))
        })
        it("Should return the right state key", () => {
            const model = createModel({
                namespace: "Counter",
                iniState: {
                    count: 0,
                    search: null,
                    flag: false,
                },
            })

            expect(model.getters.count(model.iniState)).toEqual(0)
            expect(model.getters.search(model.iniState)).toEqual(null)
            expect(model.getters.flag(model.iniState)).toEqual(false)
        })
        it("Should return the right state key by instance", () => {
            const model = createModel({
                namespace: "Counter",
                iniState: {
                    count: 0,
                    search: null,
                    flag: false,
                },
            })

            const state = {
                [model.namespace]: {
                    ...model.iniState[model.namespace],
                    counterInstance: {
                        count: 1,
                        search: { text: "hola" },
                        flag: false,
                    },
                },
            }

            expect(model.getters.count(state)).toEqual(0)
            expect(
                model.getters.count(state, { instanceId: "counterInstance" })
            ).toEqual(1)
        })

        it("Should create a special getter: `instance`", () => {
            const model = createModel({
                namespace: "Counter",
                iniState: {
                    count: 0,
                    search: null,
                },
            })
            const state = {
                [model.namespace]: {
                    ...model.iniState[model.namespace],
                    counterInstance: {
                        count: 1,
                        search: { text: "hola" },
                    },
                },
            }

            expect(model.getters.instance).toEqual(expect.any(Function))
            expect(model.getters.instance(state)).toEqual({
                count: 0,
                search: null,
            })
            expect(
                model.getters.instance(state, { instanceId: "counterInstance" })
            ).toEqual({
                count: 1,
                search: { text: "hola" },
            })
        })

        it("Should create a special getter: `namespace`", () => {
            const model = createModel({
                namespace: "Counter",
                iniState: {
                    count: 0,
                    search: null,
                },
            })
            const state = {
                [model.namespace]: {
                    ...model.iniState[model.namespace],
                    counterInstance: {
                        count: 1,
                        search: { text: "hola" },
                    },
                },
            }

            expect(model.getters.namespace).toEqual(expect.any(Function))
            expect(model.getters.namespace(state)).toEqual(
                state[model.namespace]
            )
        })

        it("Should create a special getter: `module` and it should return the entire state object", () => {
            const model = createModel({
                namespace: "Counter",
                iniState: {
                    count: 0,
                    search: null,
                },
            })
            const state = {
                [model.namespace]: {
                    ...model.iniState[model.namespace],
                    counterInstance: {
                        count: 1,
                        search: { text: "hola" },
                    },
                },
            }
            expect(model.getters.module).toEqual(expect.any(Function))
            expect(model.getters.module(state)).toEqual(state)
        })
    })

    describe("### action creators", () => {
        it("Should return one action per iniState key", () => {
            const model = createModel({
                namespace: "Counter",
                iniState: {
                    count: 0,
                    search: "",
                },
            })

            expect(model.actions.setCount).toEqual(expect.any(Function))
            expect(model.actions.setCount.type).toEqual("Counter/setCount")
            expect(model.actions.setSearch).toEqual(expect.any(Function))
            expect(model.actions.setSearch.type).toEqual("Counter/setSearch")
        })

        it("Each iniState action should take `payload`, `props` and `error` params, and return the `ActionPayload`", () => {
            const model = createModel({
                namespace: "Counter",
                iniState: {
                    count: 0,
                    search: "",
                },
            })

            expect(
                model.actions.setCount(1, {
                    meta: { instanceId: "counterInstance" },
                })
            ).toEqual({
                type: "Counter/setCount",
                payload: 1,
                meta: { instanceId: "counterInstance" },
                error: false,
                namespace: "Counter",
            })
        })

        it("Should return one action per reducers key", () => {
            const model = createModel({
                namespace: "Counter",
                iniState: {
                    count: 0,
                    search: "",
                },
                reducers: {
                    inc: ({ count }) => count + 1,
                    prepend: ({ search }, { payload: prepend }) =>
                        prepend + search,
                },
            })

            expect(model.actions.inc).toEqual(expect.any(Function))
            expect(model.actions.inc.type).toEqual("Counter/inc")
            expect(model.actions.prepend).toEqual(expect.any(Function))
            expect(model.actions.prepend.type).toEqual("Counter/prepend")
        })

        it("Each reducers action should take `payload`, `props` and `error` params, and return the `ActionPayload`", () => {
            const model = createModel({
                namespace: "Counter",
                iniState: {
                    count: 0,
                    search: "",
                },
                reducers: {
                    inc: ({ count }) => count + 1,
                    prepend: ({ search }, { payload: prepend }) =>
                        prepend + search,
                },
            })

            expect(
                model.actions.inc(null, {
                    meta: { instanceId: "counterInstance" },
                })
            ).toEqual({
                type: "Counter/inc",
                payload: null,
                meta: { instanceId: "counterInstance" },
                error: false,
                namespace: "Counter",
            })
        })
    })

    describe("### reducers", () => {
        it("Should create one set reducer per iniState key", () => {
            const model = createModel({
                namespace: "Counter",
                iniState: {
                    count: 0,
                    search: "",
                },
            })

            expect(model.reducers).toEqual({
                "Counter/setCount": expect.any(Function),
                "Counter/setSearch": expect.any(Function),
            })
        })
        it("Each reducer partially set the right key", () => {
            const model = createModel({
                namespace: "Counter",
                iniState: {
                    count: 0,
                    search: "",
                },
            })

            const state = {
                count: 0,
                search: "",
            }

            expect(
                model.reducers["Counter/setCount"](state, { payload: 2 })
            ).toEqual({ count: 2 })
            expect(
                model.reducers["Counter/setSearch"](state, { payload: "hola" })
            ).toEqual({ search: "hola" })
        })

        it("Should add the custom reducers prefixed with namespace", () => {
            const model = createModel({
                namespace: "Counter",
                iniState: {
                    count: 0,
                    search: "",
                },
                reducers: {
                    inc: ({ count }) => count + 1,
                    prepend: ({ search }, { payload: prepend }) =>
                        prepend + search,
                },
            })

            expect(model.reducers).toEqual(
                expect.objectContaining({
                    "Counter/inc": expect.any(Function),
                    "Counter/prepend": expect.any(Function),
                })
            )
        })
    })
})
