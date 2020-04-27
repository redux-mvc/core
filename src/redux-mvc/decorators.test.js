import counterModel from "Examples/ui-kit/Counter/model"
import searchBarModel from "Examples/ui-kit/SearchBar/model"

import { addReducer } from "./decorators"

import { GLOBAL_UPDATE, DEFAULT_INSTANCE_ID } from "./constants"

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

        it("Should execute the right reducer and instance", () => {
            const module = addReducer()(counterModel)

            const nextState = module.reducer(
                module.iniState,
                module.actions.setCount(1)
            )

            expect(nextState[module.namespace][DEFAULT_INSTANCE_ID]).toEqual({
                count: 1,
            })
        })

        it("Should execute the right reducer", () => {
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
    })
})
