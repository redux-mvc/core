/* eslint-disable no-underscore-dangle */
import { DEFAULT_INSTANCE_ID } from "./constants"

// lib
export const identity = x => x
export const noop = () => {}
export const propOr = (or, prop, val) => {
    if (val && typeof val[prop] !== "undefined") {
        return val[prop]
    }
    return or
}
export const prop = (...args) => propOr(undefined, ...args)

export const pathOr = (or, path, val) =>
    path.reduce((acc, key) => prop(key, acc), val) || or

export const path = (...args) => pathOr(undefined, ...args)
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

export const concatReducers = reducers => (state, action) =>
    reducers.reduce((acc, r) => r(acc, action), state)

export const capitalizeFirst = str => str[0].toUpperCase() + str.slice(1)

export const isEmpty = obj => !obj || Object.keys(obj).length === 0

export const diff = (oldObj, newObj) => {
    if (oldObj === newObj) {
        return false
    }
    if (typeof oldObj === "object" && typeof newObj === "object") {
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
