import * as R from "ramda"
import { noop } from "./utils"
import { GLOBAL_UPDATE } from "./constants"

const makeSubscribe = ({ globalStore, observedDomains, store }) => {
    let lastState = globalStore.getState()

    return () => {
        store.dispatch({
            type: `${GLOBAL_UPDATE}/init`,
            payload: R.pick(observedDomains, lastState),
        })

        return globalStore.subscribe(() => {
            const newState = globalStore.getState()

            observedDomains.forEach(key => {
                if (newState[key] !== lastState[key]) {
                    store.dispatch({
                        type: `${GLOBAL_UPDATE}/update`,
                        payload: R.pick(observedDomains, newState),
                    })
                    lastState = newState
                    return
                }
            })
        })
    }
}

export const bridge = (observedDomains, dispatchToGlobal, globalStore) => {
    // TODO: add validations

    const filter =
        (typeof dispatchToGlobal === "function" && dispatchToGlobal) || noop

    let subscription = noop
    let subscribe = noop

    const middleware = store => {
        subscribe = makeSubscribe({ globalStore, observedDomains, store })

        if (filter !== noop) {
            // eslint-disable-next-line consistent-return
            return next => action => {
                if (filter(action)) {
                    globalStore.dispatch(action)
                } else {
                    return next(action)
                }
            }
        }

        return R.identity
    }

    return {
        middleware,
        subscribe: () => {
            subscription = subscribe()
        },
        unsubscribe: subscription,
    }
}
