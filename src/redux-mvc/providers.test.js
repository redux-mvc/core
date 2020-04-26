import React from "react"
import { mount } from "enzyme"

import { createContext } from "./providers"
import { StoreManager } from "./context"
import { DEFAULT_INSTANCE_ID } from "./constants"

import counterModule from "ui-kit/Counter"

describe("## Redux-MVC context", () => {
    it("Should pass the default instance id", () => {
        const Div = createContext({
            module: counterModule,
        })(({ instanceId }) => <div>{instanceId}</div>)

        const wrapper = mount(<Div />)

        expect(wrapper.text()).toContain(DEFAULT_INSTANCE_ID)
    })

    it("Should pass the instance id prop", () => {
        const Div = createContext({
            module: counterModule,
        })(({ instanceId }) => <div>{instanceId}</div>)

        const wrapper = mount(<Div instanceId="instanceId" />)

        expect(wrapper.text()).toContain("instanceId")
    })

    it("Should set the current contextId", () => {
        const Div = createContext({
            module: counterModule,
            contextId: "context",
        })(() => (
            <StoreManager.Consumer>
                {value => value.contextId}
            </StoreManager.Consumer>
        ))

        const wrapper = mount(<Div />)

        expect(wrapper.text()).toContain("context")
    })

    it("Should create the module instance", () => {
        let moduleInstances

        const Div = createContext({
            module: counterModule,
            contextId: "context",
        })(() => (
            <StoreManager.Consumer>
                {value => {
                    moduleInstances = value.moduleInstances
                }}
            </StoreManager.Consumer>
        ))

        mount(<Div />)

        expect(moduleInstances).toEqual(
            expect.objectContaining({ context: expect.any(Object) })
        )
    })

    it("Should create the store", () => {
        let moduleInstances

        const Div = createContext({
            module: counterModule,
            contextId: "context",
        })(() => (
            <StoreManager.Consumer>
                {value => {
                    moduleInstances = value.moduleInstances
                }}
            </StoreManager.Consumer>
        ))

        mount(<Div />)

        expect(moduleInstances.context.store).toEqual(
            expect.objectContaining({
                getState: expect.any(Function),
                subscribe: expect.any(Function),
            })
        )
    })
})
