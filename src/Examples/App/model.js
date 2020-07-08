import { createModel } from "redux-mvc"

const model = createModel({
    iniState: {
        href: "",
        base: "",
    },
    reducers: {
        navigate: (_, { payload: { href } }) => ({
            href,
        }),
    },
    namespace: "App",
    singleton: true,
})

const { getters, actions } = model

export { getters, actions }

export default model
