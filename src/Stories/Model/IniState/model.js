import { createModel } from "redux-mvc"

const model = createModel({
    iniState: {
        count: 0,
    },
    namespace: "Counter",
})

const { actions, getters } = model

export { actions, getters }

export default model

export const modelCode = `import { createModel } from "redux-mvc"

const model = createModel({
    iniState: {
        count: 0,
    },
    namespace: "Counter",
})

const { actions, getters } = model

export { actions, getters }

export default model
`
