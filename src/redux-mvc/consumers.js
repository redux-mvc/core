import React, { useContext } from "react"
import hoistNonReactStatics from "hoist-non-react-statics"

import { getDisplayName } from "./utils"
import { StoreManager } from "./context"
import { useModel } from "./hooks"

export const connect = (selectors, actions, options = {}) => Component => {
    const pure = typeof options.pure === "boolean" ? options.pure : true
    const forwardRef = options.forwardRef
    const WrappedComponent =
        typeof Component === "function" && pure
            ? React.memo(Component)
            : Component

    const ConnectComponent = React.memo(props => {
        const context = useContext(StoreManager)
        const modelProps = useModel(selectors, actions, props)

        const dom = <WrappedComponent {...props} {...modelProps} />

        return (
            <StoreManager.Provider
                value={{
                    ...context,
                    instanceId: props.instanceId,
                    renderLevel: context.renderLevel + 1,
                }}
            >
                {dom}
            </StoreManager.Provider>
        )
    })

    let Connect = ConnectComponent

    if (forwardRef) {
        Connect = React.forwardRef((props, ref) => (
            <ConnectComponent {...props} reduxMVCForwardedRef={ref} />
        ))
    }

    Connect.displayName = `WithReduxMVCConnect(${getDisplayName(
        WrappedComponent
    )})`

    return hoistNonReactStatics(Connect, WrappedComponent)
}
