import React, { Component } from "react"

import { getDisplayName } from "./utils"
import { StoreManager } from "./context"

const createProxyAction = (proxy, store, that) => (
    payload,
    params = { meta: {} },
    error = false
) =>
    store.dispatch(
        proxy.actionProp(
            payload,
            {
                ...params,
                meta: {
                    instanceId:
                        that.props.instanceId || that.context.instanceId,
                    ...params.meta,
                },
            },
            error
        )
    )

// check how instances work
export const connect = (s, a) => {
    const selectors = s || {}
    const actions = a || {}
    return WrappedComponent => {
        class WithReduxMVCConnect extends Component {
            static contextType = StoreManager
            state = {
                stateProps: {},
            }
            getStore() {
                return this.context.instances[this.context.currentInstance]
            }
            constructor(props, context) {
                super(props, context)

                this.computedProps = this.getProps(
                    this.getStore().getState(),
                    selectors,
                    props,
                    context.instanceId
                )
                this.proxyActions = this.getProxyActions(
                    this.getStore(),
                    typeof actions === "function"
                        ? actions(this.computedProps)
                        : actions
                )
                this.computedActions = Object.entries(this.proxyActions).reduce(
                    (acc, [key, { proxy }]) => {
                        acc[key] = proxy
                        return acc
                    },
                    {}
                )
                this.state = {
                    runShouldComponentUpdate: {},
                }
            }
            getProps(state, selectors, props, instanceId) {
                return Object.entries(selectors).reduce((acc, [key, f]) => {
                    if (
                        typeof f.instanceId === "function" &&
                        typeof f.f === "function"
                    ) {
                        return {
                            ...acc,
                            [key]: f.f(state, {
                                ...props,
                                instanceId: f.instanceId(props),
                            }),
                        }
                    }
                    return {
                        ...acc,
                        [key]: f(state, {
                            ...props,
                            instanceId: props.instanceId || instanceId,
                        }),
                    }
                }, props)
            }

            // @NOTE: make real proxy actions
            getProxyActions(store, actions) {
                return Object.entries(actions).reduce((acc, [key, f]) => {
                    acc[key] = { actionProp: f }
                    const proxy = createProxyAction(acc[key], store, this)
                    acc[key].proxy = proxy
                    return acc
                }, {})
            }

            shouldComponentUpdate(props) {
                const nextProps = this.getProps(
                    this.getStore().getState(),
                    selectors,
                    props,
                    this.context.instanceId
                )
                for (const key in nextProps) {
                    if (nextProps[key] !== this.computedProps[key]) {
                        this.computedProps = nextProps

                        if (typeof actions === "function") {
                            const newActions = actions(this.computedProps)
                            Object.entries(this.proxyActions).forEach(
                                ([key, proxyAction]) => {
                                    if (newActions[key]) {
                                        proxyAction.actionProp = newActions[key]
                                    }
                                }
                            )
                        }
                        return true
                    }
                }
                return false
            }

            componentDidMount() {
                this.unsubscribe = this.getStore().subscribe(() => {
                    this.setState({
                        runShouldComponentUpdate: {},
                    })
                })
            }
            componentWillUnmount() {
                this.unsubscribe()
            }
            render() {
                return (
                    <WrappedComponent
                        {...this.computedProps}
                        {...this.computedActions}
                        instanceId={
                            this.props.instanceId || this.context.instanceId
                        }
                    />
                )
            }
        }

        WithReduxMVCConnect.displayName = `WithReduxMVCConnect(${getDisplayName(
            WrappedComponent
        )})`

        return WithReduxMVCConnect
    }
}
