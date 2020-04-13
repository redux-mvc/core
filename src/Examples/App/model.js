import { createModel } from "redux-mvc"

const model = createModel({
    iniState: {
        locationStr: "",
    },
    reducers: {
        navigate: (_, { payload }) => ({
            locationStr: payload.href,
        }),
    },
    namespace: "App",
})

const { getters, actions } = model

export { getters, actions }

export default model
