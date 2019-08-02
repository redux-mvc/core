import { createModel } from "redux-mvc"

const iniState = {
    search: "",
}

const model = createModel({
    iniState,
    namespace: "SearchBar",
})

const { actions, selectors } = model

export { actions, selectors }

export default model
