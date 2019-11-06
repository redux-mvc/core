import * as R from "ramda"
import { createModel } from "redux-mvc"

const model = createModel({
    iniState: {
        fixedCount: 30,
    },
    reducers: {
        create: R.always({ created: true }),
    },
    namespace: "App",
})

const { actions, selectors } = model

export { actions, selectors }

export default model
