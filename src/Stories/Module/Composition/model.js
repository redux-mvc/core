import { createModel } from "redux-mvc"

const iniState = {
    loading: false,
}

const model = createModel({
    iniState,
    namespace: "CounterAndSearchbar",
})

const { actions, getters } = model

export { actions, getters }

export default model

export const modelCode = `
import { createModel } from "redux-mvc"

const iniState = {
    loading: false,
}

const model = createModel({
    iniState,
    namespace: "CounterAndSearchbar",
})


const { actions, getters } = model

export { actions, getters }

export default model
`
