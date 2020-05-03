import * as R from "./utils"

import { DEFAULT_INSTANCE_ID } from "./constants"

describe("## Utils", () => {
    describe("### identity", () => {
        it("Should be the identity function", () => {
            const x = {}

            expect(R.identity(x)).toBe(x)
        })
    })

    describe("### noop", () => {
        it("Should always return undefined", () => {
            expect(R.noop({})).toBe(undefined)
            expect(R.noop("")).toBe(undefined)
            expect(R.noop(true)).toBe(undefined)
            expect(R.noop(1)).toBe(undefined)
            expect(R.noop(1, "", {})).toBe(undefined)
        })
    })

    describe("### propOr", () => {
        it("Should return the prop if found in the object", () => {
            expect(R.propOr("baz", "foo", { foo: false })).toBe(false)
        })
        it("Should return the fallback if not found in the object or nil", () => {
            expect(R.propOr("baz", "foo")).toBe("baz")
            expect(R.propOr("baz", "foo", {})).toBe("baz")
            expect(R.propOr("baz", "foo", { baz: "foo" })).toBe("baz")
            expect(R.propOr("baz", "foo", { foo: undefined })).toBe("baz")
            expect(R.propOr("baz", "foo", { foo: null })).toBe("baz")
        })
    })

    describe("### prop", () => {
        it("Should return the prop if found in the object", () => {
            expect(R.prop("foo", { foo: false })).toBe(false)
            expect(R.prop("bar", { bar: null })).toBe(null)
        })
        it("Should return undefined if not found in the object or nil", () => {
            expect(R.prop("bar", { foo: "bar" })).toBe(undefined)
            expect(R.prop("bar")).toBe(undefined)
        })
    })

    describe("### pathOr", () => {
        it("Should return the prop if found in the object", () => {
            expect(
                R.pathOr("baz", ["foo", "bar"], { foo: { bar: false } })
            ).toBe(false)
        })
        it("Should return the fallback if not found in any step of the object", () => {
            expect(
                R.pathOr("baz", ["foo", "bar"], { foo: { baz: "bar" } })
            ).toBe("baz")
            expect(R.pathOr("baz", ["foo", "bar"], { foo: {} })).toBe("baz")
            expect(R.pathOr("baz", ["foo", "bar"], { foo: "bar" })).toBe("baz")
            expect(R.pathOr("baz", ["foo", "bar"], {})).toBe("baz")
            expect(R.pathOr("baz", ["foo", "bar"])).toBe("baz")
        })
    })

    describe("### path", () => {
        it("Should return the prop if found in the object", () => {
            expect(R.path(["foo", "bar"], { foo: { bar: false } })).toBe(false)
            expect(R.path(["foo", "bar"], { foo: { bar: null } })).toBe(null)
        })

        it("Should return undefined if not found in any step of the object", () => {
            expect(R.path(["foo", "bar"], { foo: { baz: "bar" } })).toBe(
                undefined
            )
            expect(R.path(["foo", "bar"], { foo: {} })).toBe(undefined)
            expect(R.path(["foo", "bar"], { foo: "bar" })).toBe(undefined)
            expect(R.path(["foo", "bar"], {})).toBe(undefined)
            expect(R.path(["foo", "bar"])).toBe(undefined)
        })
    })

    describe("### has", () => {
        it("Should return true if the property exists", () => {
            expect(R.has(["foo", "bar"], { foo: { bar: false } })).toBe(true)
            expect(R.has(["foo"], { foo: false })).toBe(true)
            expect(R.has(["foo"], { foo: "" })).toBe(true)
        })

        it("Should return false if the property does not exist", () => {
            expect(R.has(["foo"], { bar: false })).toBe(false)
            expect(R.has(["foo"], {})).toBe(false)
            expect(R.has(["foo"])).toBe(false)
        })
    })

    describe("### mergeAll", () => {
        it("Should merge all objects", () => {
            expect(R.mergeAll([{ foo: "bar" }, { baz: "viz" }])).toEqual({
                foo: "bar",
                baz: "viz",
            })
        })

        it("Should override with the far right", () => {
            expect(
                R.mergeAll([{ foo: "bar" }, { baz: "viz", foo: "foo" }])
            ).toEqual({
                foo: "foo",
                baz: "viz",
            })
        })

        it("Should ignore undefined or null", () => {
            expect(
                R.mergeAll([
                    { foo: "bar" },
                    { baz: "viz", foo: "foo" },
                    undefined,
                    null,
                ])
            ).toEqual({
                foo: "foo",
                baz: "viz",
            })
        })
    })

    describe("### getSelectorInstanceId", () => {
        it("Should return the instanceId or DEFAULT_INSTANCE_ID", () => {
            expect(R.getSelectorInstanceId({ instanceId: "foo" })).toBe("foo")
            expect(R.getSelectorInstanceId({ bar: "foo" })).toBe(
                DEFAULT_INSTANCE_ID
            )
        })

        it("Should return the DEFAULT_INSTANCE_ID if singleton is true", () => {
            expect(R.getSelectorInstanceId({ instanceId: "foo" }, true)).toBe(
                DEFAULT_INSTANCE_ID
            )
            expect(R.getSelectorInstanceId({ instanceId: "foo" }, false)).toBe(
                "foo"
            )
        })
    })

    describe("### getActionInstanceId", () => {
        it("Should return the instanceId or DEFAULT_INSTANCE_ID", () => {
            expect(R.getActionInstanceId({ meta: { instanceId: "foo" } })).toBe(
                "foo"
            )
            expect(R.getActionInstanceId({ meta: { bar: "foo" } })).toBe(
                DEFAULT_INSTANCE_ID
            )
            expect(R.getActionInstanceId({ meta: {} })).toBe(
                DEFAULT_INSTANCE_ID
            )
            expect(R.getActionInstanceId({})).toBe(DEFAULT_INSTANCE_ID)
        })

        it("Should return the DEFAULT_INSTANCE_ID if singleton is true", () => {
            expect(
                R.getActionInstanceId({ meta: { instanceId: "foo" } }, true)
            ).toBe(DEFAULT_INSTANCE_ID)

            expect(
                R.getActionInstanceId({ meta: { instanceId: "foo" } }, false)
            ).toBe("foo")
        })
    })

    describe("### getDisplayName", () => {
        it("Should return the displayName", () => {
            expect(R.getDisplayName({ displayName: "name" })).toBe("name")
            expect(
                R.getDisplayName({ displayName: "name", name: "other" })
            ).toBe("name")
            expect(R.getDisplayName({ name: "other" })).toBe("other")
            expect(R.getDisplayName({})).toBe("Component")
        })
    })

    describe("### capitalizeFirst", () => {
        it("Should capitalize the first letter", () => {
            expect(R.capitalizeFirst("name")).toBe("Name")
            expect(R.capitalizeFirst("n")).toBe("N")
        })
    })

    describe("### isEmpty", () => {
        it("Should return true if object is empty", () => {
            expect(R.isEmpty()).toBe(true)
            expect(R.isEmpty({})).toBe(true)
            expect(R.isEmpty([])).toBe(true)
            expect(R.isEmpty("")).toBe(true)
            expect(R.isEmpty({ name: "name" })).toBe(false)
        })
    })

    describe("### diff", () => {
        it("Should return true if objects values are different", () => {
            expect(R.diff({ foo: "bar" }, { foo: "baz" })).toBe(true)
            expect(R.diff({ foo: "bar", bar: "baz" }, { foo: "bar" })).toBe(
                true
            )
            expect(R.diff({ foo: "bar" }, { foo: "bar", bar: "baz" })).toBe(
                true
            )
        })
        it("Should return false if objects values are the same instance", () => {
            const A = {}
            expect(R.diff({ foo: "bar", bar: A }, { foo: "bar", bar: A })).toBe(
                false
            )
            expect(
                R.diff({ foo: "bar", bar: {} }, { foo: "bar", bar: {} })
            ).toBe(true)
        })
        it("Should be a shallow diff", () => {
            const A = { foo: "bar", bar: { baz: "baz" } }
            const B = { ...A }
            B.bar.foo = "foo"
            expect(R.diff(A, B)).toBe(false)
        })
        it("Should diff only keys", () => {
            const A = {}
            expect(
                R.diff(
                    { foo: "bar", bar: A, baz: "foo" },
                    { foo: "bar", bar: A, baz: {} },
                    ["foo", "bar"]
                )
            ).toBe(false)
            expect(
                R.diff(
                    { foo: "bar", bar: A, baz: "foo" },
                    { foo: "bar", bar: "foo", baz: {} },
                    ["foo", "bar"]
                )
            ).toBe(true)
        })
        it("Should return false if the objects are the same instance", () => {
            const A = {}
            expect(R.diff(A, A)).toBe(false)
        })
        it("Should not compare if params are not objects", () => {
            expect(R.diff("", "")).toBe(false)
            expect(R.diff({}, "")).toBe(false)
            expect(R.diff("", {})).toBe(false)
        })
    })

    describe("### uniq", () => {
        it("Should return unique vals in an array", () => {
            expect(
                R.uniq(["one", "one", "two", "three", "three", "three"])
            ).toEqual(["one", "two", "three"])
        })
        it("Should return an empty array", () => {
            expect(R.uniq([])).toEqual([])
        })
    })

    describe("### pick", () => {
        it("Should return the listed key values or undefined", () => {
            expect(
                R.pick(["foo", "bar"], { foo: "bar", bar: "foo", baz: "baz" })
            ).toEqual({ foo: "bar", bar: "foo" })
            expect(
                R.pick(["foo", "name"], { foo: "bar", bar: "foo", baz: "baz" })
            ).toEqual({ foo: "bar", name: undefined })
            expect(R.pick(["foo", "bar"], {})).toEqual({})
        })

        it("Should return an empty object if the params are invalid", () => {
            expect(R.pick([], {})).toEqual({})
            expect(R.pick(["foo", "bar"])).toEqual({})
            expect(R.pick()).toEqual({})
        })
    })

    describe("### applyBridgeMiddleware", () => {
        it("Should return false there's no global instance", () => {
            const moduleInstance = {}
            expect(
                R.applyBridgeMiddleware({
                    moduleInstance,
                })
            ).toBe(false)
        })
        it("Should return true if moduleInsance is the globalInstance", () => {
            const moduleInstance = {}
            expect(
                R.applyBridgeMiddleware({
                    moduleInstance,
                    globalInstance: moduleInstance,
                })
            ).toBe(true)
        })
        it("Should return true if the global instance exists and the module tracks global namespaces", () => {
            const moduleInstance = { trackGlobalNamespaces: ["App"] }
            expect(
                R.applyBridgeMiddleware({
                    moduleInstance,
                    globalInstance: {},
                })
            ).toBe(true)
        })
        it("Should return true if the global instance exists and the module dispatches actions to the global", () => {
            const moduleInstance = { dispatchToGlobal: R.identity }
            expect(
                R.applyBridgeMiddleware({
                    moduleInstance,
                    globalInstance: {},
                })
            ).toBe(true)
        })
        it("Should return false if the module does not dispatch or observe the global", () => {
            expect(
                R.applyBridgeMiddleware({
                    moduleInstance: {},
                    globalInstance: {},
                })
            ).toBe(false)
        })
    })
})
