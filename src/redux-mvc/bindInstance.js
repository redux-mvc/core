export const defaultInstanceId = "default"

export const bindInstance = (actions, instanceId) =>
    Object.entries(actions).reduce(
        (acc, [key, fn]) => ({
            ...acc,
            [key]: {
                f: fn,
                instanceId,
            },
        }),
        {}
    )
