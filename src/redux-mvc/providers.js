import React, { Component } from "react"

import { path, getDisplayName, noop } from "./utils"
import { bridge } from "./middleware"

import { StoreManager } from "./context"

import { GLOBAL_CONTEXT_ID, DEFAULT_INSTANCE_ID } from "./constants"

const addBridge = ({ observedDomains, globalStore }) =>
    Boolean(globalStore) &&
    (Array.isArray(observedDomains) && observedDomains.length > 0)

export const createContext = ({
    module,
    persist = true,
    contextId = Symbol("MVCContextId"),
    ...options
}) => WrappedComponent => {
    class WithReduxMVCContext extends Component {
        static contextType = StoreManager

        unregisterStart = noop
        unregisterStop = noop

        constructor(props, context) {
            super(props, context)

            if (
                persist &&
                path(["moduleInstances", contextId, "store"], context)
            ) {
                this.store = path(
                    ["moduleInstances", contextId, "store"],
                    context
                )
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

                    this.unregisterStart = module.on("start", subscribe)
                    this.unregisterStop = module.on("stop", unsubscribe)
                    bridgeMiddleware = middleware
                }

                const store = module.createStore({
                    bridgeMiddleware,
                    ...options,
                })

                this.store = store
                context.moduleInstances[contextId] = { store }
            }

            module.emit("start", context.moduleInstances[contextId])
        }

        componentWillUnmount() {
            module.emit("stop", this.context.moduleInstances[contextId])
            if (!persist) {
                this.unregisterStart()
                this.unregisterStop()
                this.context.moduleInstances[contextId] = {}
            }
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
