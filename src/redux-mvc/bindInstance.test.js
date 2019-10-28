import * as R from "ramda"
import { bindInstance } from "./bindInstance"

describe("# bindInstance", () => {
    it("## should bind the default instance id function", () => {
        const actions = {
            create: jest.fn(),
            delete: jest.fn(),
        }

        const binded = bindInstance(actions, R.path(["person", "first"]))

        expect(typeof binded).toEqual("object")

        expect(typeof binded.create.f).toEqual("function")
        expect(typeof binded.delete.f).toEqual("function")

        expect(typeof binded.create.instanceId).toEqual("function")
        expect(typeof binded.delete.instanceId).toEqual("function")

        expect(
            binded.create.instanceId({ person: { first: "instance" } })
        ).toEqual("instance")
        expect(
            binded.delete.instanceId({ person: { first: "instance" } })
        ).toEqual("instance")
    })
})
