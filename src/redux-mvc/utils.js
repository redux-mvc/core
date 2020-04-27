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

    const list = keys || oldObj

    if (typeof oldObj === "object" && typeof newObj === "object") {
        if (Object.keys(oldObj).length === Object.keys(newObj).length) {
            for (const key in list) {
                if (oldObj[key] !== newObj[key]) {
                    return true
                }
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
          }, {})
        : {}
