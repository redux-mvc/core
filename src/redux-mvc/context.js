import React, { Component } from "react"

import { getDisplayName } from "./utils"
import { bridge } from "./middleware"

const notBind = ["constructor", "componentWillUnmount"]

const addBridge = ({ observedDomains, dispatchToGlobal, globalStore }) =>
    Boolean(globalStore) &&
    (Array.isArray(observedDomains) && observedDomains.length > 0) &&
    ((Array.isArray(dispatchToGlobal) && dispatchToGlobal.length > 0) ||
        typeof dispatchToGlobal === "function")

export const ReduxMVCContext = React.createContext({ store: null })

export const withReduxMVCContext = ({
    module,
    lifeCycle = {},
    handlers = {},
    options = {},
}) => {
    const instance = {}
    return WrappedComponent => {
        class WithReduxMVCContext extends Component {
            static contextType = ReduxMVCContext

            constructor(props, context) {
                super(props, context)

                this.handlers = {}
                Object.entries(handlers).forEach(([key, f]) => {
                    this.handlers[key] = f.bind(this)
                })

                Object.entries(lifeCycle).forEach(([key, f]) => {
                    if (!notBind.includes(key)) {
                        this[key] = f.bind(this)
                    }
                })

                let bridgeMiddleware = () => () => () => {}

                if (
                    addBridge({
                        observedDomains: options.observedDomains,
                        dispatchToGlobal: options.dispatchToGlobal,
                        globalStore: context.store,
                    })
                ) {
                    const { middleware, unsubscribe, subscribe } = bridge(
                        options.observedDomains || [],
                        options.dispatchToGlobal || [],
                        context.store
                    )

                    module.on("run", subscribe)
                    module.on("cancel", unsubscribe)
                    bridgeMiddleware = middleware
                }

                const store = module.createStore({
                    instance,
                    bridgeMiddleware,
                    ...options,
                })

                this.store = store

                if (lifeCycle.constructor) {
                    lifeCycle.constructor.call(this, props, context)
                }

                this.runModule(module)
            }

            runModule(module) {
                module.dispatch("run")
            }

            cancelModule(module) {
                module.dispatch("cancel")
            }

            componentWillUnmount() {
                if (lifeCycle.componentWillUnmount) {
                    lifeCycle.componentWillUnmount.call(this)
                }
                this.cancelModule(module)
            }

            render() {
                return (
                    <ReduxMVCContext.Provider value={{ store: this.store }}>
                        <WrappedComponent
                            {...this.props}
                            handlers={this.handlers}
                        />
                    </ReduxMVCContext.Provider>
                )
            }
        }

        WithReduxMVCContext.displayName = `WithReduxMVCContext(${getDisplayName(
            WrappedComponent
        )})`

        return WithReduxMVCContext
    }
}
