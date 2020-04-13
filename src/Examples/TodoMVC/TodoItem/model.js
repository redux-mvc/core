import * as R from "ramda"

import { createModel } from "redux-mvc"

const model = createModel({
    iniState: {
        editing: false,
        value: "",
    },
    reducers: {
        enableEditing: (_, { payload: value }) => ({
            editing: true,
            value,
        }),
        toggleCompleted: R.identity,
        commit: R.always({ editing: false }),
        cancel: R.always({ editing: false, value: "" }),
    },
    namespace: "UITodoItem",
})

const { getters, actions } = model

export { getters, actions }

export default model
