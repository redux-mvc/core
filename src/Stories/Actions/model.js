import * as R from "ramda"
import { createModel } from "redux-mvc"

const model = createModel({
    iniState: {
        text: "",
    },
    reducers: {
        save: (state, { payload: text, meta, error }) =>
            error ? state : { text: R.concat(meta.prefix, text) },
    },
    namespace: "Text",
})

const { actions, getters } = model

export { actions, getters }

export default model

export const modelCode = `import * as R from "ramda"
import { createModel } from "redux-mvc"

const model = createModel({
    iniState: {
        text: "",
    },
    reducers: {
        save: (state, { payload: text, meta, error }) =>
            error ? state : { text: R.concat(meta.prefix, text) },
    },
    namespace: "Text",
})

const { actions, getters } = model

export { actions, getters }

export default model
`
