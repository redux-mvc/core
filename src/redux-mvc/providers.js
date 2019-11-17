import React, { Component } from "react"

import { getDisplayName } from "./utils"
import { bridge } from "./middleware"

import { StoreManager } from "./context"

import {
    REDUX_MVC_GLOBAL_STORE_INSTANCE,
    DEFAULT_INSTANCE_ID,
} from "./constants"

const notBind = ["constructor", "componentWillUnmount"]

const defGetInstanceId = props => props.instanceId

const addBridge = ({ observedDomains, globalStore }) =>
    Boolean(globalStore) &&
    (Array.isArray(observedDomains) && observedDomains.length > 0)

export const createContext = ({
    module,
    lifeCycle = {},
    handlers = {},
    options: roptions,
    instance = Symbol("MVCContextInstance"),
}) => WrappedComponent => {
    const options = {
        persist: true,
        ...roptions,
    }
    const getInstanceId = options.getInstanceId || defGetInstanceId

    class WithReduxMVCContext extends Component {
        static contextType = StoreManager

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

            if (options.persist && context.instances[instance]) {
                this.store = context.instances[instance]
            } else {
                let bridgeMiddleware

                if (
                    instance !== REDUX_MVC_GLOBAL_STORE_INSTANCE &&
                    addBridge({
                        observedDomains: module.observedDomains,
                        globalStore:
                            context.instances[REDUX_MVC_GLOBAL_STORE_INSTANCE],
                    })
                ) {
                    const { middleware, unsubscribe, subscribe } = bridge(
                        module.observedDomains || [],
                        module.dispatchToGlobal || [],
                        context.store
                    )

                    module.on("run", subscribe)
                    module.on("cancel", unsubscribe)
                    bridgeMiddleware = middleware
                }

                const store = module.createStore({
                    bridgeMiddleware,
                    ...options,
                })

                this.store = store
                context.instances[instance] = store
            }

            module.dispatch("run")
        }

        componentWillUnmount() {
            module.dispatch("cancel")
        }

        render() {
            return (
                <StoreManager.Provider
                    value={{
                        ...this.context,
                        currentInstance: instance,
                        instanceId:
                            getInstanceId(this.props) || DEFAULT_INSTANCE_ID,
                    }}
                >
                    <WrappedComponent
                        handlers={this.handlers}
                        {...this.props}
                    />
                </StoreManager.Provider>
            )
        }
    }

    WithReduxMVCContext.displayName = `WithReduxMVCContext(${getDisplayName(
        WrappedComponent
    )})`

    return WithReduxMVCContext
}
