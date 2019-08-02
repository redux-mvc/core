export const defaultInstanceId = "default"

const assoc = (key, value, obj) => {
    obj[key] = value
    return obj
}

export const bindInstance = (actions, instanceKey) => {
    const getIntance =
        typeof instanceKey === "function"
            ? instanceKey
            : x => (x && x.instanceId) || defaultInstanceId

    return sym =>
        Object.entries(actions).reduce(
            (acc, [key, fn]) => ({
                ...acc,
                [key]: assoc(sym, getIntance, fn),
            }),
            {}
        )
}
