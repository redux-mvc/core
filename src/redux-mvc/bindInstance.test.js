import * as R from "ramda"
import { bindInstance } from "./bindInstance"

describe("# bindInstance", () => {
    describe("## should bind the instance id functions", () => {
        const actions = {
            create: jest.fn(),
            delete: jest.fn(),
        }

        const symbol = Symbol("instance")
        const binded = bindInstance(actions)(symbol)

        expect(typeof binded.create[symbol]).toEqual("function")
        expect(typeof binded.delete[symbol]).toEqual("function")

        expect(binded.create[symbol]({ instanceId: "instance" })).toEqual(
            "instance"
        )
        expect(binded.delete[symbol]({ instanceId: "instance" })).toEqual(
            "instance"
        )
    })

    describe("## should take a getInstance function", () => {
        const actions = {
            create: jest.fn(),
        }

        const symbol = Symbol("instance")
        const binded = bindInstance(actions, R.path(["person", "first"]))(
            symbol
        )

        expect(typeof binded.create[symbol]).toEqual("function")

        expect(binded.create[symbol]({ person: { first: "gonzalo" } })).toEqual(
            "gonzalo"
        )
    })
})
