import { createModel } from "redux-mvc"

const iniState = {
    count: 0,
}

const model = createModel({
    iniState,
    reducers: {
        add: ({ count }) => ({ count: count + 1 }),
    },
    namespace: "App",
})

const { actions, selectors } = model

export { actions, selectors }

export default model
