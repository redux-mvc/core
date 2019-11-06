import * as R from "ramda"

import React from "react"
import { mount } from "enzyme"

import { createContext } from "./providers"
import { connect } from "./consumers"

import pageModule from "Page"
import { actions, selectors } from "Page/model"

import {
    actions as CounterActions,
    selectors as CounterSelectors,
} from "ui-kit/Counter/model"

describe("## Redux-MVC connect", () => {
    it("Should pass the global instance as props", () => {
        const Div = props => <div id="div">{props.instanceId}</div>

        const decorate = R.compose(
            createContext({
                module: pageModule,
            }),
            connect()
        )

        const App = decorate(Div)

        const wrapper = mount(<App instanceId="globalInstance" />)
        expect(wrapper.find("#div").text()).toBe("globalInstance")
    })

    it("Should pass the default instance as props", () => {
        const Div = props => <div id="div">{props.instanceId}</div>

        const decorate = R.compose(
            createContext({
                module: pageModule,
            }),
            connect()
        )

        const App = decorate(Div)

        const wrapper = mount(<App />)
        expect(wrapper.find("#div").text()).toBe("default")
    })

    it("Should pass the connected state", () => {
        const Div = props => <div id="div">{props.count}</div>

        const decorate = R.compose(
            createContext({
                module: pageModule,
            }),
            connect({ count: CounterSelectors.count })
        )

        const App = decorate(Div)

        const wrapper = mount(<App />)
        expect(wrapper.find("#div").text()).toBe("0")
    })

    it("Should re-render when the state is updated", () => {
        const Div = connect({ count: CounterSelectors.count })(props => (
            <div id="div">{props.count}</div>
        ))
        const App = createContext({
            module: pageModule,
        })(({ children }) => <div>{children}</div>)

        const wrapper = mount(
            <App>
                <Div />
            </App>
        )

        expect(wrapper.find("#div").text()).toBe("0")

        const instance = wrapper.instance()
        instance.store.dispatch(CounterActions.add())

        expect(wrapper.find("#div").text()).toBe("1")
    })

    it("Should pass the connected state from the global instance", () => {
        const Div = connect({ count: CounterSelectors.count })(props => (
            <div id="div">{props.count}</div>
        ))
        const App = createContext({
            module: pageModule,
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
        const Div = connect({ count: CounterSelectors.count })(props => (
            <div id="div">{props.count}</div>
        ))
        const App = createContext({
            module: pageModule,
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
                onClick: (_, ...params) => CounterActions.add(null, ...params),
            }
        )(props => <div id="div" onClick={props.onClick} />)

        const App = createContext({
            module: pageModule,
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
                onClick: (_, ...params) => CounterActions.add(null, ...params),
            }
        )(props => <div id="div" onClick={props.onClick} />)

        const App = createContext({
            module: pageModule,
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
                onClick: (_, ...params) => CounterActions.add(null, ...params),
            }
        )(props => <div id="div" onClick={props.onClick} />)

        const App = createContext({
            module: pageModule,
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

    it("Should take a function as second parameter to use the props", () => {
        const Div = connect(
            null,
            props => ({
                onClick: (_, ...params) =>
                    CounterActions.setCount(props.fixedCount, ...params),
            })
        )(props => <div id="div" onClick={props.onClick} />)

        const App = createContext({
            module: pageModule,
        })(({ children }) => <div>{children}</div>)

        const wrapper = mount(
            <App>
                <Div fixedCount={10} />
            </App>
        )
        wrapper.find("#div").simulate("click")
        const instance = wrapper.instance()

        expect(instance.store.getState().Counter).toEqual({
            default: {
                count: 10,
            },
        })
    })

    it("Should dispatch the updated fixedCount", () => {
        const Div = connect(
            { fixedCount: selectors.fixedCount },
            props => ({
                onClick: (_, ...params) =>
                    CounterActions.setCount(props.fixedCount, ...params),
            })
        )(props => <div id="div" onClick={props.onClick} />)

        const App = createContext({
            module: pageModule,
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
                count: 30,
            },
        })

        instance.store.dispatch(actions.setFixedCount(10))
        wrapper.find("#div").simulate("click")

        expect(instance.store.getState().Counter).toEqual({
            default: {
                count: 10,
            },
        })
    })
})
