import * as R from "ramda"
import { createModel } from "redux-mvc"

const iniState = {
    count: 0,
}

const model = createModel({
    iniState,
    reducers: {
        add: ({ count }) => ({ count: count + 1 }),
        reset: R.always(iniState),
    },
    namespace: "Counter",
})

const { actions, selectors } = model

export { actions, selectors }

export default model
