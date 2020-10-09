import React, { useContext, useMemo } from "react"
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

    const ConnectComponent = props => {
        const context = useContext(StoreManager)
        const modelProps = useModel(selectors, actions, props)
        const newContext = useMemo(() => {
            return {
                ...context,
                instanceId: modelProps.instanceId,
                renderLevel: context.renderLevel + 1,
            }
        }, [context, modelProps.instanceId])

        const dom = <WrappedComponent {...props} {...modelProps} />

        return (
            <StoreManager.Provider value={newContext}>
                {dom}
            </StoreManager.Provider>
        )
    }

    ConnectComponent.displayName = `MVCInyectProps(${getDisplayName(
        Component
    )})`

    let Connect = React.memo(ConnectComponent)

    if (forwardRef) {
        Connect = React.forwardRef((props, ref) => (
            <ConnectComponent {...props} reduxMVCForwardedRef={ref} />
        ))
    }

    Connect.displayName = `MVCConnect(${getDisplayName(Component)})`

    return hoistNonReactStatics(Connect, Component)
}
