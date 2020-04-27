import * as R from "ramda"

import React from "react"
import { mount } from "enzyme"

import { createContext } from "./providers"
import { connect } from "./consumers"

import counterModule from "Examples/ui-kit/Counter/index"

import {
    actions as CounterActions,
    getters as CounterGetters,
} from "Examples/ui-kit/Counter/model"

describe("## Redux-MVC connect", () => {
    it("Should pass the context instance as props", () => {
        const Div = connect()(props => <div id="div">{props.instanceId}</div>)
        const App = createContext({
            module: counterModule,
        })(({ children }) => <div>{children}</div>)

        const wrapper = mount(
            <App instanceId="contextInstanceId">
                <Div />
            </App>
        )

        expect(wrapper.find("#div").text()).toBe("contextInstanceId")
    })

    it("Should pass the default instance as props", () => {
        const Div = connect()(props => <div id="div">{props.instanceId}</div>)
        const App = createContext({
            module: counterModule,
        })(({ children }) => <div>{children}</div>)

        const wrapper = mount(
            <App>
                <Div />
            </App>
        )

        expect(wrapper.find("#div").text()).toBe("default")
    })

    it("Should pass the connected state", () => {
        const Div = connect({ count: CounterGetters.count })(props => (
            <div id="div">{props.count}</div>
        ))

        const App = createContext({
            module: counterModule,
        })(({ children }) => <div>{children}</div>)

        const wrapper = mount(
            <App>
                <Div />
            </App>
        )

        const instance = wrapper.instance()
        instance.store.dispatch(CounterActions.add())

        expect(wrapper.find("#div").text()).toBe("1")
    })

    it("Should re-render when the state is updated", () => {
        const spy = jest.fn(props => <div id="div">{props.count}</div>)
        const Div = connect({ count: CounterGetters.count })(spy)
        const App = createContext({
            module: counterModule,
        })(({ children }) => <div>{children}</div>)

        const wrapper = mount(
            <App>
                <Div />
            </App>
        )

        expect(wrapper.find("#div").text()).toBe("0")
        expect(spy.mock.calls.length).toBe(1)

        const instance = wrapper.instance()
        instance.store.dispatch(CounterActions.add())

        expect(wrapper.find("#div").text()).toBe("1")
        expect(spy.mock.calls.length).toBe(2)
    })

    it("Should re-render if props change", () => {
        const spy = jest.fn(props => <div id="div">{props.count}</div>)
        const decorate = R.compose(
            createContext({
                module: counterModule,
            }),
            connect()
        )
        const Div = decorate(spy)

        const wrapper = mount(<Div count={0} />)
        expect(spy.mock.calls.length).toBe(1)

        expect(wrapper.find("#div").text()).toBe("0")

        wrapper.setProps({ count: 1 })
        expect(wrapper.find("#div").text()).toBe("1")
        expect(spy.mock.calls.length).toBe(2)
    })

    it("Should not re-render when the state is updated but the stateProps don't change", () => {
        const spy = jest.fn(props => <div id="div">{props.count}</div>)
        const Div = connect({ count: CounterGetters.count })(spy)
        const App = createContext({
            module: counterModule,
        })(({ children }) => <div>{children}</div>)

        const wrapper = mount(
            <App>
                <Div instanceId="counter" />
            </App>
        )

        expect(wrapper.find("#div").text()).toBe("0")
        expect(spy.mock.calls.length).toBe(1)

        const instance = wrapper.instance()
        instance.store.dispatch(
            CounterActions.add(null, { meta: { instanceId: "counter2" } })
        )

        expect(wrapper.find("#div").text()).toBe("0")
        expect(spy.mock.calls.length).toBe(1)
    })

    it("Should pass the connected state from the context instance", () => {
        const Div = connect({ count: CounterGetters.count })(props => (
            <div id="div">{props.count}</div>
        ))
        const App = createContext({
            module: counterModule,
        })(({ children }) => <div>{children}</div>)

        const wrapper = mount(
            <App instanceId="instance1">
                <Div />
            </App>
        )
        const instance = wrapper.instance()
        instance.store.dispatch(
            CounterActions.add(null, { meta: { instanceId: "instance1" } })
        )

        expect(wrapper.find("#div").text()).toBe("1")
    })

    it("Should pass the connected state from the instance prop", () => {
        const Div = connect({ count: CounterGetters.count })(props => (
            <div id="div">{props.count}</div>
        ))
        const App = createContext({
            module: counterModule,
        })(({ children }) => <div>{children}</div>)

        const wrapper = mount(
            <App instanceId="instance1">
                <Div instanceId="instance2" />
            </App>
        )
        const instance = wrapper.instance()
        instance.store.dispatch(
            CounterActions.add(null, { meta: { instanceId: "instance2" } })
        )

        expect(wrapper.find("#div").text()).toBe("1")
    })

    it("Should pass the connected action", () => {
        const Div = connect(
            null,
            {
                onClick: CounterActions.add,
            }
        )(props => <div id="div" onClick={props.onClick} />)

        const App = createContext({
            module: counterModule,
        })(({ children }) => <div>{children}</div>)

        const wrapper = mount(
            <App>
                <Div />
            </App>
        )
        wrapper.find("#div").simulate("click")
        const instance = wrapper.instance()

        expect(instance.store.getState().Counter).toEqual({
            default: {
                count: 1,
            },
        })
    })

    it("Should dispatch to the context instance", () => {
        const Div = connect(
            null,
            {
                onClick: CounterActions.add,
            }
        )(props => <div id="div" onClick={props.onClick} />)

        const App = createContext({
            module: counterModule,
        })(({ children }) => <div>{children}</div>)

        const wrapper = mount(
            <App instanceId="instance1">
                <Div />
            </App>
        )
        wrapper.find("#div").simulate("click")
        const instance = wrapper.instance()

        expect(instance.store.getState().Counter).toEqual({
            default: {
                count: 0,
            },
            instance1: {
                count: 1,
            },
        })
    })

    it("Should dispatch to the instance prop", () => {
        const Div = connect(
            null,
            {
                onClick: CounterActions.add,
            }
        )(props => <div id="div" onClick={props.onClick} />)

        const App = createContext({
            module: counterModule,
        })(({ children }) => <div>{children}</div>)

        const wrapper = mount(
            <App instanceId="instance1">
                <Div instanceId="instance2" />
            </App>
        )
        wrapper.find("#div").simulate("click")
        const instance = wrapper.instance()

        expect(instance.store.getState().Counter).toEqual({
            default: {
                count: 0,
            },
            instance2: {
                count: 1,
            },
        })
    })

    it("should call getters if props change", () => {
        const fixedCount = jest.fn(() => 10)

        const Div = connect({ fixedCount })(props => (
            <div id="div">{props.text}</div>
        ))

        const App = createContext({
            module: counterModule,
        })(({ text }) => <Div text={text} />)

        const wrapper = mount(<App text="hola" />)

        expect(wrapper.find("#div").text()).toBe("hola")
        expect(fixedCount.mock.calls.length).toBe(1)

        wrapper.setProps({ text: "chau" })
        expect(wrapper.find("#div").text()).toBe("chau")
        expect(fixedCount.mock.calls.length).toBe(2)
    })
})
