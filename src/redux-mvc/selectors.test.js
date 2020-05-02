import * as R from "ramda"

import counterModule from "Examples/ui-kit/Counter"
import searchBarModule from "Examples/ui-kit/SearchBar"

import { createSelector } from "./selectors"
import { merge, addReducer } from "./decorators"

describe("## Create Selector", () => {
    it("Should return a selector function", () => {
        const selector = createSelector(
            counterModule.getters.count,
            R.inc
        )

        expect(selector).toEqual(expect.any(Function))
        expect(typeof selector.id).toEqual("symbol")
        expect(selector.dependencies).toEqual([counterModule.getters.count])
        expect(selector.resultFn).toEqual(R.inc)
        expect(selector.ownCache).toEqual(
            expect.objectContaining({
                [selector.id]: {},
            })
        )
    })

    it("Should return the same function if no dependencies where passed", () => {
        const selector = createSelector(counterModule.getters.count)

        expect(selector).toEqual(counterModule.getters.count)
    })

    it("Should compute the value once if dependencies dont change", () => {
        const count = jest.fn(counterModule.getters.count)
        const resultFn = jest.fn(R.inc)
        const selector = createSelector(
            count,
            resultFn
        )

        const value = selector(counterModule.iniState)

        expect(value).toEqual(1)
        expect(count).toHaveBeenCalledTimes(1)
        expect(resultFn).toHaveBeenCalledTimes(1)

        const newValue = selector(counterModule.iniState)
        expect(newValue).toEqual(1)
        expect(count).toHaveBeenCalledTimes(2)
        expect(resultFn).toHaveBeenCalledTimes(1)
    })

    it("Should re-compute the value if dependencies change", () => {
        const count = jest.fn(counterModule.getters.count)
        const resultFn = jest.fn(R.inc)
        const selector = createSelector(
            count,
            resultFn
        )

        const value = selector(counterModule.iniState)

        expect(value).toEqual(1)
        expect(count).toHaveBeenCalledTimes(1)
        expect(resultFn).toHaveBeenCalledTimes(1)

        const newValue = selector(
            counterModule.reducer(
                counterModule.iniState,
                counterModule.actions.add()
            )
        )
        expect(newValue).toEqual(2)
        expect(count).toHaveBeenCalledTimes(2)
        expect(resultFn).toHaveBeenCalledTimes(2)
    })

    it("Should re-compute the value for a different instanceId", () => {
        const count = jest.fn(counterModule.getters.count)
        const resultFn = jest.fn(R.inc)
        const selector = createSelector(
            count,
            resultFn
        )

        const value = selector(counterModule.iniState)

        expect(value).toEqual(1)
        expect(count).toHaveBeenCalledTimes(1)
        expect(resultFn).toHaveBeenCalledTimes(1)

        const instanceValue = selector(
            counterModule.reducer(
                counterModule.iniState,
                counterModule.actions.add()
            ),
            { instanceId: "counter" }
        )

        expect(instanceValue).toEqual(1)
        expect(count).toHaveBeenCalledTimes(2)
        expect(resultFn).toHaveBeenCalledTimes(2)
    })

    it("Should compose selectors and call the dependencies and result functions when needed", () => {
        const module = addReducer()(merge(searchBarModule)(counterModule))
        const count = jest.fn(counterModule.getters.count)
        const inc = jest.fn(
            R.compose(
                R.toString,
                R.inc
            )
        )
        const oneMore = createSelector(
            count,
            inc
        )
        const search = jest.fn(searchBarModule.getters.search)
        const prepend = jest.fn(R.concat("el "))
        const greetings = createSelector(
            search,
            prepend
        )

        const resultFn = jest.fn(R.concat)
        const onePlusGreetings = createSelector(
            greetings,
            oneMore,
            resultFn
        )

        const value = onePlusGreetings(module.iniState)

        expect(value).toEqual("el 1")
        expect(count).toHaveBeenCalledTimes(1)
        expect(inc).toHaveBeenCalledTimes(1)
        expect(search).toHaveBeenCalledTimes(1)
        expect(prepend).toHaveBeenCalledTimes(1)
        expect(resultFn).toHaveBeenCalledTimes(1)

        const newValue = onePlusGreetings(
            module.reducer(module.iniState, counterModule.actions.add())
        )

        expect(newValue).toEqual("el 2")
        expect(count).toHaveBeenCalledTimes(2)
        expect(inc).toHaveBeenCalledTimes(2)
        expect(search).toHaveBeenCalledTimes(2)
        expect(prepend).toHaveBeenCalledTimes(1)
        expect(resultFn).toHaveBeenCalledTimes(2)
    })

    it("Should use the cache parameter", () => {
        const module = addReducer()(merge(searchBarModule)(counterModule))
        const count = jest.fn(counterModule.getters.count)
        const inc = jest.fn(
            R.compose(
                R.toString,
                R.inc
            )
        )
        const oneMore = createSelector(
            count,
            inc
        )
        const search = jest.fn(searchBarModule.getters.search)
        const prepend = jest.fn(R.concat("el "))
        const greetings = createSelector(
            search,
            prepend
        )

        const resultFn = jest.fn(R.concat)
        const onePlusGreetings = createSelector(
            greetings,
            oneMore,
            resultFn
        )

        const cache = {}
        onePlusGreetings(module.iniState, {}, cache)

        expect(cache).toEqual(
            expect.objectContaining({
                [onePlusGreetings.id]: expect.any(Object),
                [greetings.id]: expect.any(Object),
                [oneMore.id]: expect.any(Object),
            })
        )
    })

    it("Should recompute the resultFn with a new cache", () => {
        const module = addReducer()(merge(searchBarModule)(counterModule))
        const count = jest.fn(counterModule.getters.count)
        const inc = jest.fn(
            R.compose(
                R.toString,
                R.inc
            )
        )
        const oneMore = createSelector(
            count,
            inc
        )
        const search = jest.fn(searchBarModule.getters.search)
        const prepend = jest.fn(R.concat("el "))
        const greetings = createSelector(
            search,
            prepend
        )

        const resultFn = jest.fn(R.concat)
        const onePlusGreetings = createSelector(
            greetings,
            oneMore,
            resultFn
        )

        const cache = {}
        onePlusGreetings(module.iniState, {}, cache)

        expect(count).toHaveBeenCalledTimes(1)
        expect(inc).toHaveBeenCalledTimes(1)
        expect(search).toHaveBeenCalledTimes(1)
        expect(prepend).toHaveBeenCalledTimes(1)
        expect(resultFn).toHaveBeenCalledTimes(1)

        const newCache = {}
        onePlusGreetings(module.iniState, {}, newCache)

        expect(count).toHaveBeenCalledTimes(2)
        expect(inc).toHaveBeenCalledTimes(2)
        expect(search).toHaveBeenCalledTimes(2)
        expect(prepend).toHaveBeenCalledTimes(2)
        expect(resultFn).toHaveBeenCalledTimes(2)
    })
})
