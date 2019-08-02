import * as R from "ramda"

import { createModel } from "redux-mvc"

const iniState = {
    message: "Hola Mundo!",
}

const model = createModel({
    iniState,
    reducers: {
        sayHello: R.identity,
    },
    namespace: "App",
})

const { actions, selectors } = model

export { actions, selectors }

export default model
