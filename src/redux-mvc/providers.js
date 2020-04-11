import React, { Component } from "react"

import { getDisplayName } from "./utils"
import { bridge } from "./middleware"

import { StoreManager } from "./context"

import { GLOBAL_CONTEXT_ID, DEFAULT_INSTANCE_ID } from "./constants"

const notBind = ["constructor", "componentWillUnmount"]

const addBridge = ({ observedDomains, globalStore }) =>
    Boolean(globalStore) &&
    (Array.isArray(observedDomains) && observedDomains.length > 0)

export const createContext = ({
    module,
    lifeCycle = {},
    handlers = {},
    options: roptions,
    contextId = Symbol("MVCContextInstance"),
}) => WrappedComponent => {
    const options = {
        persist: true,
        ...roptions,
    }

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

            if (options.persist && context.moduleInstances[contextId]) {
                this.store = context.moduleInstances[contextId]
            } else {
                let bridgeMiddleware

                if (
                    contextId !== GLOBAL_CONTEXT_ID &&
                    addBridge({
                        observedDomains: module.observedDomains,
                        globalStore: context.moduleInstances[GLOBAL_CONTEXT_ID],
                    })
                ) {
                    const { middleware, unsubscribe, subscribe } = bridge(
                        module.observedDomains || [],
                        module.dispatchToGlobal || [],
                        context.store
                    )

                    module.on("start", subscribe)
                    module.on("stop", unsubscribe)
                    bridgeMiddleware = middleware
                }

                const store = module.createStore({
                    bridgeMiddleware,
                    ...options,
                })

                this.store = store
                context.moduleInstances[contextId] = store
            }

            module.emit("start")
        }

        componentWillUnmount() {
            module.emit("stop")
        }

        render() {
            return (
                <StoreManager.Provider
                    value={{
                        ...this.context,
                        contextId,
                        instanceId:
                            this.props.instanceId || DEFAULT_INSTANCE_ID,
                    }}
                >
                    <WrappedComponent
                        handlers={this.handlers}
                        {...this.props}
                        instanceId={
                            this.props.instanceId || DEFAULT_INSTANCE_ID
                        }
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
