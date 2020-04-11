import React, { useContext } from "react"

import { getDisplayName } from "./utils"
import { StoreManager } from "./context"
import { useModel } from "./hooks"

// check how instances work
export const connect = (selectors, actions) => Component => {
    const WrappedComponent =
        typeof Component === "function" ? React.memo(Component) : Component

    const WithReduxMVCConnect = props => {
        const context = useContext(StoreManager)
        const modelProps = useModel(selectors, actions, props)

        const dom = <WrappedComponent {...props} {...modelProps} />

        if (props.instanceId && props.instanceId !== context.instanceId) {
            return (
                <StoreManager.Provider
                    value={{ ...context, instanceId: props.instanceId }}
                >
                    {dom}
                </StoreManager.Provider>
            )
        }
        return dom
    }

    WithReduxMVCConnect.displayName = `WithReduxMVCConnect(${getDisplayName(
        WrappedComponent
    )})`

    return WithReduxMVCConnect
}
