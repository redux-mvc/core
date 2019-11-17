import { createModel } from "redux-mvc"

const iniState = {
    search: "",
}

const model = createModel({
    iniState,
    namespace: "SearchBar",
})

const { actions, getters } = model

export { actions, getters }

export default model
