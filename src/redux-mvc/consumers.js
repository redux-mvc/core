import React from "react"
import hoistNonReactStatics from "hoist-non-react-statics"

import { getDisplayName, propOr, path, isEmpty, diff } from "./utils"
import { StoreManager } from "./context"

const getStateProps = ({ selectors, instanceId, cache, state, props }) =>
    Object.entries(selectors || {}).reduce((acc, [key, f]) => {
        if (f.id) {
            cache[f.id] = cache[f.id] || {}
        }
        return {
            ...acc,
            [key]: f(
                state,
                {
                    ...(props || {}),
                    instanceId,
                },
                cache
            ),
        }
    }, {})

export const connect = (selectors, actions, options = {}) => Component => {
    const forwardRef = options.forwardRef

    class ConnectComponent extends React.PureComponent {
        static contextType = StoreManager

        constructor(props, context) {
            super(props, context)
            const store = path(
                ["moduleInstances", context.contextId, "store"],
                context
            )
            const instanceId = propOr(context.instanceId, "instanceId", props)

            const cache = {}

            this.state = {
                cache,
                store,
                stateProps: {},
                context: {
                    ...context,
                    instanceId: instanceId,
                    renderLevel: context.renderLevel + 1,
                },
            }

            this.subscription = store.subscribe(() => {
                this.recomputeStateProps()
            }, context.renderLevel)
        }

        static getDerivedStateFromProps(withChildren, state) {
            // eslint-disable-next-line no-unused-vars
            const { children, ...props } = withChildren
            const newState = {}

            const instanceId = propOr(
                state.context.instanceId,
                "instanceId",
                props
            )

            const newStateProps = getStateProps({
                selectors,
                instanceId,
                cache: state.cache,
                state: state.store.getState(),
                props,
            })

            if (diff(state.stateProps, newStateProps)) {
                newState.stateProps = newStateProps
            }

            if (!state.actionProps || instanceId !== state.context.instanceId) {
                newState.actionProps = ConnectComponent.computeActionProps(
                    props,
                    state
                )
                newState.context = {
                    ...state.context,
                    instanceId,
                }
            }

            if (isEmpty(newState)) {
                return null
            }
            return newState
        }

        static computeActionProps(props, state) {
            const instanceId = propOr(
                state.context.instanceId,
                "instanceId",
                props
            )
            return Object.entries(actions || {}).reduce((actions, [key, f]) => {
                if (typeof f !== "function") {
                    throw Error(`${key} is not a function`)
                }

                actions[key] = (payload, props = {}, error = false) =>
                    state.store.dispatch(
                        f(
                            payload,
                            {
                                ...props,
                                meta: {
                                    instanceId,
                                    ...(props.meta || {}),
                                },
                            },
                            error
                        )
                    )
                return actions
            }, {})
        }

        recomputeStateProps() {
            const newState = ConnectComponent.getDerivedStateFromProps(
                this.props,
                this.state
            )
            if (newState) {
                this.setState(newState)
            }
        }

        componentWillUnmout() {
            this.subscription()
        }

        render() {
            const { stateProps, actionProps, context } = this.state
            const { children, ...props } = this.props
            return (
                <StoreManager.Provider value={context}>
                    <Component
                        instanceId={context.instanceId}
                        {...props}
                        {...stateProps}
                        {...actionProps}
                    >
                        {children}
                    </Component>
                </StoreManager.Provider>
            )
        }
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
