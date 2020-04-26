import React, { Component } from "react"

import { getDisplayName } from "./utils"

import { StoreManager } from "./context"

import { DEFAULT_INSTANCE_ID } from "./constants"

export const createContext = ({
    module,
    contextId = Symbol("MVCContextId"),
    ...options
}) => WrappedComponent => {
    class WithReduxMVCContext extends Component {
        static contextType = StoreManager

        constructor(props, context) {
            super(props, context)

            this.callLifeCycle("constructor")
        }

        updateModuleInstance(moduleInstance) {
            if (moduleInstance) {
                this.context.moduleInstances[contextId] = moduleInstance
                this.store = moduleInstance.store
            }
        }

        lifeCycleExists(name, module) {
            return typeof module[name] === "function"
        }

        callLifeCycle(name, params = {}) {
            if (this.lifeCycleExists(name, module)) {
                this.updateModuleInstance(
                    module[name].call(this, {
                        moduleInstances: this.context.moduleInstances,
                        contextId,
                        ...options,
                        ...params,
                    })
                )
            }
        }

        componentDidCatch(error, info) {
            this.callLifeCycle("componentDidCatch", { error, info })
        }

        componentDidMount() {
            this.callLifeCycle("componentDidMount")
        }

        componentWillUnmount() {
            this.callLifeCycle("componentWillUnmount")
        }

        render() {
            const instanceId = this.props.instanceId || DEFAULT_INSTANCE_ID
            return (
                <StoreManager.Provider
                    value={{
                        ...this.context,
                        contextId,
                        instanceId,
                    }}
                >
                    <WrappedComponent {...this.props} instanceId={instanceId} />
                </StoreManager.Provider>
            )
        }
    }

    WithReduxMVCContext.displayName = `WithReduxMVCContext(${getDisplayName(
        WrappedComponent
    )})`

    return WithReduxMVCContext
}
