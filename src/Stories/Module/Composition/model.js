import { createModel } from "redux-mvc"

const model = createModel({
    namespace: "CounterAndSearchbar",
})

const { actions, getters } = model

export { actions, getters }

export default model

export const modelCode = `
import { createModel } from "redux-mvc"

const model = createModel({
    namespace: "CounterAndSearchbar",
})


const { actions, getters } = model

export { actions, getters }

export default model
`
