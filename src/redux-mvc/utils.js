/* eslint-disable no-underscore-dangle */
import { DEFAULT_INSTANCE_ID } from "./constants"

// lib
export const identity = x => x
export const noop = () => {}
export const propOr = (or, prop, val) => {
    if (val && typeof val[prop] !== "undefined" && val[prop] !== null) {
        return val[prop]
    }
    return or
}

export const prop = (prop, val) => {
    if (val) {
        return val[prop]
    }
    return undefined
}

export const pathOr = (or, path, val) => {
    const result = path.reduce((acc, key) => prop(key, acc), val)

    return typeof result !== "undefined" && result !== null ? result : or
}

export const path = (path, val) =>
    path.reduce((acc, key) => prop(key, acc), val)

const EMPTY = Symbol("empty")
export const has = (...args) => pathOr(EMPTY, ...args) !== EMPTY

export const mergeAll = all =>
    all.reduce((acc, val) => ({ ...acc, ...(val || {}) }), {})

// mvc utils
export const getSelectorInstanceId = (props, singleton) =>
    singleton
        ? DEFAULT_INSTANCE_ID
        : propOr(DEFAULT_INSTANCE_ID, "instanceId", props)

export const getActionInstanceId = (action, singleton) =>
    singleton
        ? DEFAULT_INSTANCE_ID
        : pathOr(DEFAULT_INSTANCE_ID, ["meta", "instanceId"], action)

export const getDisplayName = WrappedComponent => {
    return WrappedComponent.displayName || WrappedComponent.name || "Component"
}

export const capitalizeFirst = str => str[0].toUpperCase() + str.slice(1)

export const isEmpty = obj => !obj || Object.keys(obj).length === 0

export const diff = (oldObj, newObj, keys) => {
    if (oldObj === newObj) {
        return false
    }

    if (typeof oldObj === "object" && typeof newObj === "object") {
        if (Array.isArray(keys)) {
            for (const key of keys) {
                if (oldObj[key] !== newObj[key]) {
                    return true
                }
            }
            return false
        }

        if (Object.keys(oldObj).length !== Object.keys(newObj).length) {
            return true
        }
        for (const key in oldObj) {
            if (oldObj[key] !== newObj[key]) {
                return true
            }
        }
    }
    return false
}

export const uniq = arr =>
    Object.values(arr.reduce((acc, key) => ({ ...acc, [key]: key }), {}))

export const pick = (arr, obj) =>
    Array.isArray(arr) && obj
        ? arr.reduce((pick, key) => {
              pick[key] = obj[key]
              return pick
          }, {})
        : {}

export const applyBridgeMiddleware = ({ moduleInstance, globalInstance }) => {
    if (!globalInstance) {
        return false
    }
    if (moduleInstance === globalInstance) {
        return true
    }
    if (
        moduleInstance.trackGlobalNamespaces &&
        moduleInstance.trackGlobalNamespaces.length
    ) {
        return true
    }
    if (typeof moduleInstance.dispatchToGlobal === "function") {
        return true
    }
    return false
}

export const ensureAncestorRender = store => {
    const listeners = {}

    const subscribe = (listener, renderLevel = "last") => {
        const id = Symbol("listener")
        listeners[renderLevel] = { ...listeners[renderLevel], [id]: listener }

        return () => {
            // eslint-disable-next-line no-unused-vars
            const { [id]: remove, ...rest } = listeners[renderLevel] || {}
            listeners[renderLevel] = rest
        }
    }

    const execute = () => {
        const lastListeners = listeners.last
        const len = Object.keys(listeners).length - (lastListeners ? 1 : 0)
        for (let i = 0; i < len; i++) {
            const levelListeners = listeners[i.toString()]
            Object.getOwnPropertySymbols(levelListeners).forEach(sym =>
                levelListeners[sym]()
            )
        }

        Object.getOwnPropertySymbols(listeners.last || {}).forEach(sym =>
            listeners.last[sym]()
        )
    }
    let subscription = noop

    const unsubscribeExecute = () => {
        subscription()
        subscription = noop
    }

    const subscribeExecute = () => {
        subscription = store.subscribe(execute)
    }

    return {
        ...store,
        subscribe,
        subscribeExecute,
        unsubscribeExecute,
    }
}
