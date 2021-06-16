import { pick, diff, has, noop } from "./utils"
import { GLOBAL_UPDATE } from "./constants"

export const globalUpdate = (action, state) => ({
    ...action,
    meta: { ...(action.meta || {}), [GLOBAL_UPDATE]: state },
})

export const makeBridgeMiddleware = ({ moduleInstance, globalInstance }) => {
    let middleware = noop
    if (moduleInstance !== globalInstance) {
        // eslint-disable-next-line no-unused-vars
        middleware = store => next => action => {
            if (
                moduleInstance.enableDispatchToGlobal &&
                !has(["meta", GLOBAL_UPDATE], action) &&
                moduleInstance.dispatchToGlobal(action)
            ) {
                return (
                    globalInstance &&
                    globalInstance.store &&
                    globalInstance.store.dispatch(action)
                )
            }
            return next(action)
        }
    } else {
        middleware = store => {
            let lastState = store.getState()
            return next => action => {
                const nextAction = next(action)

                const listeners = Object.values(globalInstance.listeners || {})
                if (listeners.length === 0) {
                    return nextAction
                }

                const nextState = store.getState()

                if (diff(lastState, nextState)) {
                    listeners.forEach(({ dispatch, trackGlobalNamespaces }) => {
                        if (diff(lastState, nextState, trackGlobalNamespaces)) {
                            dispatch(
                                globalUpdate(
                                    action,
                                    pick(trackGlobalNamespaces, nextState)
                                )
                            )
                        }
                    })
                    lastState = nextState
                }
                return nextAction
            }
        }
    }

    middleware.bind = () => {
        if (moduleInstance !== globalInstance) {
            moduleInstance.enableDispatchToGlobal =
                typeof moduleInstance.dispatchToGlobal === "function"
            if (
                moduleInstance.trackGlobalNamespaces &&
                moduleInstance.trackGlobalNamespaces.length
            ) {
                globalInstance.listeners = {
                    ...(globalInstance.listeners || {}),
                    [moduleInstance.namespace]: {
                        trackGlobalNamespaces:
                            moduleInstance.trackGlobalNamespaces,
                        dispatch: moduleInstance.store.dispatch,
                    },
                }
            }
        }
    }
    middleware.unbind = () => {
        if (moduleInstance !== globalInstance) {
            moduleInstance.enableDispatchToGlobal = false
            // eslint-disable-next-line no-unused-vars
            const { [moduleInstance.namespace]: remove, ...listeners } =
                globalInstance.listeners || {}

            globalInstance.listeners = listeners
        }
    }

    return middleware
}
