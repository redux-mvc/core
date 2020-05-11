import React from "react"

import { GLOBAL_CONTEXT_ID, DEFAULT_INSTANCE_ID } from "./constants"

export const StoreManager = React.createContext({
    moduleInstances: {},
    contextId: GLOBAL_CONTEXT_ID,
    instanceId: DEFAULT_INSTANCE_ID,
    renderLevel: 0,
})
