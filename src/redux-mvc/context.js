import React from "react"

import {
    REDUX_MVC_GLOBAL_STORE_INSTANCE,
    DEFAULT_INSTANCE_ID,
} from "./constants"

export const StoreManager = React.createContext({
    instances: {},
    currentInstance: REDUX_MVC_GLOBAL_STORE_INSTANCE,
    instanceId: DEFAULT_INSTANCE_ID,
})
