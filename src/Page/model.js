import * as R from "ramda"
import { createModel } from "redux-mvc"

const model = createModel({
    iniState: {
        fixedCount: 30,
    },
    reducers: {
        create: R.always({ created: true }),
        delete: R.always({ created: false }),
    },
    namespace: "App",
})

const { actions, getters } = model

export { actions, getters }

export default model
