import React, { Component } from "react"

import { getDisplayName } from "./utils"
import { ReduxMVCContext } from "./context"

const createProxyAction = (f, instance, store) => (
    payload,
    params = { meta: {} },
    error = false
) => store.dispatch(f(payload, params, error))

export const connect = (selectors, actions) => {
    return WrappedComponent => {
        class WithReduxMVCConnect extends Component {
            static contextType = ReduxMVCContext
            state = {
                stateProps: {},
            }
            constructor(props, context) {
                super(props, context)

                this.state = {
                    props: this.getProps(
                        context.store.getState(),
                        selectors,
                        props
                    ),
                    proxyActions: this.getProxyActions(context.store, actions),
                }
            }
            getProps(state, selectors, props) {
                return Object.entries(selectors).reduce(
                    (acc, [key, f]) => ({
                        ...acc,
                        [key]: f(state, props),
                    }),
                    props
                )
            }
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
                        this.context.store.getState(),
                        selectors,
                        nextProps
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
                this.unsubscribe = this.context.store.subscribe(() => {
                    this.setState({
                        props: this.getProps(
                            this.context.store.getState(),
                            selectors,
                            this.props
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
