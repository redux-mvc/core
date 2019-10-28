import React from "react"
import { mount } from "enzyme"

import { createContext } from "./providers"
import { StoreManager } from "./context"
import {
    REDUX_MVC_GLOBAL_STORE_INSTANCE,
    DEFAULT_INSTANCE_ID,
} from "./constants"

import counterModule from "ui-kit/Counter"
import { actions } from "ui-kit/Counter/model"
import Counter from "ui-kit/Counter/View"

describe("## Redux-MVC context", () => {
    it("The default namespace should be available", () => {
        const decorate = createContext({
            module: counterModule,
        })

        const App = decorate(Counter)

        const wrapper = mount(<App />)
        const instance = wrapper.instance()

        expect(wrapper.text()).toContain("0")

        instance.store.dispatch(actions.add())
        expect(wrapper.text()).toContain("1")

        instance.store.dispatch(actions.reset())
        expect(wrapper.text()).toContain("0")
    })

    it("Should update the default instance", () => {
        const decorate = createContext({
            module: counterModule,
        })

        const App = decorate(Counter)

        const wrapper = mount(<App />)
        const instance = wrapper.instance()

        expect(wrapper.text()).toContain("0")

        wrapper.find("button").simulate("click")
        expect(wrapper.text()).toContain("1")
        expect(instance.store.getState()).toEqual({
            Counter: {
                default: {
                    count: 1,
                },
            },
        })
    })

    it("Should set the instance to the context", () => {
        const decorate = createContext({
            module: counterModule,
        })

        const App = decorate(() => (
            <div>
                <Counter />
            </div>
        ))

        const wrapper = mount(<App instanceId="instance1" />)
        const instance = wrapper.instance()

        expect(wrapper.text()).toContain("0")

        wrapper.find("button").simulate("click")
        expect(wrapper.text()).toContain("1")
        expect(instance.store.getState()).toEqual({
            Counter: {
                default: {
                    count: 0,
                },
                instance1: {
                    count: 1,
                },
            },
        })
    })

    it("Should keep the state when unmounted by default `options.persist`", () => {
        const decorate = createContext({
            module: counterModule,
            options: {},
            instance: "module-instance",
        })

        const instances = {}
        const App = decorate(Counter)
        const Wrapper = ({ children }) => (
            <StoreManager.Provider
                value={{
                    instances,
                    currentInstance: REDUX_MVC_GLOBAL_STORE_INSTANCE,
                    instanceId: DEFAULT_INSTANCE_ID,
                }}
            >
                {children}
            </StoreManager.Provider>
        )

        const wrapper = mount(<App />, {
            wrappingComponent: Wrapper,
        })
        const instance = wrapper.instance()

        expect(wrapper.text()).toContain("0")

        wrapper.find("button").simulate("click")
        expect(wrapper.text()).toContain("1")
        expect(instance.store.getState()).toEqual({
            Counter: {
                default: {
                    count: 1,
                },
            },
        })
        wrapper.unmount()

        const wrapper2 = mount(<App />, {
            wrappingComponent: Wrapper,
        })
        const instance2 = wrapper2.instance()
        expect(instance2.store.getState()).toEqual({
            Counter: {
                default: {
                    count: 1,
                },
            },
        })
    })

    it("Should erase the state when unmounted", () => {
        const decorate = createContext({
            module: counterModule,
            options: {
                persist: false,
            },
            instance: "module-instance",
        })

        const instances = {}
        const App = decorate(Counter)
        const Wrapper = ({ children }) => (
            <StoreManager.Provider
                value={{
                    instances,
                    currentInstance: REDUX_MVC_GLOBAL_STORE_INSTANCE,
                    instanceId: DEFAULT_INSTANCE_ID,
                }}
            >
                {children}
            </StoreManager.Provider>
        )

        const wrapper = mount(<App />, {
            wrappingComponent: Wrapper,
        })
        const instance = wrapper.instance()

        expect(wrapper.text()).toContain("0")

        wrapper.find("button").simulate("click")
        expect(wrapper.text()).toContain("1")
        expect(instance.store.getState()).toEqual({
            Counter: {
                default: {
                    count: 1,
                },
            },
        })
        wrapper.unmount()

        const wrapper2 = mount(<App />, {
            wrappingComponent: Wrapper,
        })
        const instance2 = wrapper2.instance()
        expect(instance2.store.getState()).toEqual({
            Counter: {
                default: {
                    count: 0,
                },
            },
        })
    })
})
