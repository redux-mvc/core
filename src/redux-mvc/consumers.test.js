import * as R from "ramda"

import React, { Component } from "react"
import { mount } from "enzyme"

import { StoreManager } from "./context"
import { createContext } from "./providers"
import { connect } from "./consumers"

import pageModule from "Page"
import { actions, getters } from "Page/model"

import {
    actions as CounterActions,
    getters as CounterGetters,
} from "ui-kit/Counter/model"

import { noop } from "redux-mvc/utils"

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
            connect({ count: CounterGetters.count })
        )

        const App = decorate(Div)

        const wrapper = mount(<App />)
        expect(wrapper.find("#div").text()).toBe("0")
    })

    it("Should re-render when the state is updated", () => {
        const Div = connect({ count: CounterGetters.count })(props => (
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
        const Div = connect({ count: CounterGetters.count })(props => (
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
        const Div = connect({ count: CounterGetters.count })(props => (
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

    // check issue with enzime, or check working example PassProp
    it.skip("Should pass a prop", () => {
        const Div = connect()(props => <div id="div">{props.sum}</div>)
        const App = createContext({
            module: pageModule,
        })(({ children }) => <div>{children}</div>)

        const wrapper = mount(<Div sum={1} />, { wrappingComponent: App })
        expect(wrapper.find("#div").text()).toBe("1")

        wrapper.setProps({ sum: 2 })
        expect(wrapper.find("#div").text()).toBe("2")
    })

    // check issue with enzime, or check working example PassProp, fails when context is added
    it.skip("Test", () => {
        const makeHoc = () => Wrapped =>
            class Div extends Component {
                static contextType = StoreManager
                constructor(props) {
                    super(props)
                    this.computedProps = props
                }
                shouldComponentUpdate(props) {
                    console.log("update", props)
                    this.computedProps = props
                    return true
                }
                render() {
                    console.log("render", this.computedProps)
                    return <Wrapped {...this.computedProps} />
                }
            }

        const Div = makeHoc()(props => <div id="div">{props.sum}</div>)
        const App = createContext({
            module: pageModule,
        })(({ children }) => <div>{children}</div>)
        const wrapper = mount(<Div sum={1} />, { wrappingComponent: App })
        expect(wrapper.find("#div").text()).toBe("1")

        wrapper.setProps({ sum: 2 })
        expect(wrapper.find("#div").text()).toBe("2")
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
            { fixedCount: getters.fixedCount },
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

    it("Should re-render once when the state is updated", () => {
        let rendered = 0

        const Div = connect(
            { fixedCount: getters.fixedCount },
            props => ({
                onClick: (_, ...params) =>
                    CounterActions.setCount(props.fixedCount, ...params),
            })
        )(props => {
            rendered += 1
            return <div id="div" onClick={props.onClick} />
        })

        const App = createContext({
            module: pageModule,
        })(({ children }) => <div>{children}</div>)

        const wrapper = mount(
            <App>
                <Div />
            </App>
        )

        rendered = 0
        const instance = wrapper.instance()
        instance.store.dispatch(actions.setFixedCount(10))

        expect(rendered).toEqual(1)
    })

    it("Should re-render once if props change", () => {
        let rendered = 0

        const Div = connect(
            { fixedCount: getters.fixedCount },
            props => ({
                onClick: (_, ...params) =>
                    CounterActions.setCount(props.fixedCount, ...params),
            })
        )(props => {
            rendered += 1
            return <div id="div" onClick={props.onClick} />
        })

        const App = createContext({
            module: pageModule,
        })(({ children }) => <div>{children}</div>)

        const wrapper = mount(<Div text="hola" />, { wrappingComponent: App })

        rendered = 0
        wrapper.setProps({ text: "chau" })

        expect(rendered).toEqual(1)
    })

    it("Should not re-render if the updated state is not observed", () => {
        let rendered = 0

        const Div = connect(
            { fixedCount: getters.fixedCount },
            props => ({
                onClick: (_, ...params) =>
                    CounterActions.setCount(props.fixedCount, ...params),
            })
        )(props => {
            rendered += 1
            return <div id="div" onClick={props.onClick} />
        })

        const App = createContext({
            module: pageModule,
        })(({ children }) => <div>{children}</div>)

        const wrapper = mount(
            <App>
                <Div />
            </App>
        )

        rendered = 0
        const instance = wrapper.instance()
        instance.store.dispatch(actions.delete())

        expect(rendered).toEqual(0)
    })

    // check issue with enzime, or check working example PassProp
    it.skip("Getters should be called if props change", () => {
        const fixedCount = jest.fn(() => 10)
        const mapDispatch = jest.fn(() => ({ onClick: noop }))

        const Div = connect(
            { fixedCount: fixedCount },
            mapDispatch
        )(props => <div id="div" onClick={props.onClick} />)

        const App = createContext({
            module: pageModule,
        })(({ children }) => <div>{children}</div>)

        const wrapper = mount(<Div text="hola" />, { wrappingComponent: App })

        expect(fixedCount.mock.calls.length).toBe(1)

        wrapper.setProps({ text: "chau" })
        expect(fixedCount.mock.calls.length).toBe(2)
    })
})
