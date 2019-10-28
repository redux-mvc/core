import React, { Component } from "react"

import { getDisplayName } from "./utils"
import { StoreManager } from "./context"

const createProxyAction = (f, that, store) => (
    payload,
    params = { meta: {} },
    error = false
) => {
    if (typeof f.instanceId === "function" && typeof f.f === "function") {
        return store.dispatch(
            f.f(
                payload,
                {
                    ...params,
                    meta: {
                        ...params.meta,
                        instanceId: f.instanceId(that.props),
                    },
                },
                error
            )
        )
    }

    return store.dispatch(
        f(
            payload,
            {
                ...params,
                meta: {
                    ...params.meta,
                    instanceId:
                        that.props.instanceId || that.context.instanceId,
                },
            },
            error
        )
    )
}

// check how instances work
export const connect = (selectors = {}, actions = {}) => {
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

                this.state = {
                    props: this.getProps(
                        this.getStore().getState(),
                        selectors,
                        props,
                        context.instanceId
                    ),
                    proxyActions: this.getProxyActions(
                        this.getStore(),
                        actions
                    ),
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
                return Object.entries(actions).reduce(
                    (acc, [key, f]) => ({
                        ...acc,
                        [key]: createProxyAction(f, this, store),
                    }),
                    {}
                )
            }

            componentWillReceiveProps(nextProps) {
                this.setState({
                    props: this.getProps(
                        this.getStore().getState(),
                        selectors,
                        nextProps,
                        this.context.instanceId
                    ),
                })
            }

            shouldComponentUpdate(_, nextState) {
                for (const key in nextState.props) {
                    if (nextState.props[key] !== this.state.props[key]) {
                        return true
                    }
                }
                return false
            }

            componentDidMount() {
                this.unsubscribe = this.getStore().subscribe(() => {
                    this.setState({
                        props: this.getProps(
                            this.getStore().getState(),
                            selectors,
                            this.props,
                            this.context.instanceId
                        ),
                    })
                })
            }
            componentWillUnmount() {
                this.unsubscribe()
            }
            render() {
                return (
                    <WrappedComponent
                        {...this.state.props}
                        {...this.state.proxyActions}
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
