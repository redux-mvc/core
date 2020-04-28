import * as R from "ramda"
import { createModel } from "redux-mvc"

const model = createModel({
    iniState: {
        locationStr: "",
        hashStr: "",
    },
    reducers: {
        setLocation: (_, { payload: { locationStr, hashStr } }) => ({
            locationStr,
            hashStr,
        }),
        navigate: (_, { payload }) => ({
            locationStr: R.nth(1, R.match(/^(.*)#.*$/i, payload.href)) || "/",
            hashStr: R.nth(1, R.match(/^.*(#\/.*)$/i, payload.href)) || "#/",
        }),
    },
    namespace: "App",
})

const { getters, actions } = model

export { getters, actions }

export default model
