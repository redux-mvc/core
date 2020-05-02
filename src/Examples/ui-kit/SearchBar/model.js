import * as R from "ramda"

import { createModel } from "redux-mvc"

const iniState = {
    search: "",
}

const model = createModel({
    iniState,
    reducers: {
        identity: R.identity,
    },
    namespace: "SearchBar",
    singleton: true,
})

const { actions, getters } = model

export { actions, getters }

export default model
