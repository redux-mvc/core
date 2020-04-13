import * as R from "ramda"
import { createModel } from "redux-mvc"

const model = createModel({
    iniState: {
        todos: {},
        all: [],
        completed: [],
    },
    reducers: {
        edit: ({ todos }, { payload: { id, ...props } }) => ({
            todos: {
                ...todos,
                [id]: {
                    ...(todos[id] || {}),
                    ...props,
                },
            },
        }),
        add: ({ todos, all }, { payload: todo }) => ({
            todos: {
                ...todos,
                [todo.id]: todo,
            },
            all: R.uniq([...all, todo.id]),
        }),
        remove: ({ todos, all, completed }, { payload: id }) => ({
            todos: R.omit([id], todos),
            all: R.without([id], all),
            completed: R.without([id], completed),
        }),
        toggleComplete: ({ completed }, { payload: id }) => ({
            completed: R.symmetricDifference([id], completed),
        }),
        toggleAll: ({ all, completed }) =>
            R.length(all) === R.length(completed)
                ? {
                      completed: [],
                  }
                : { completed: all },
        clearCompleted: ({ todos, all, completed }) => ({
            todos: R.omit(completed, todos),
            completed: [],
            all: R.without(completed, all),
        }),
    },
    namespace: "TodoData",
    singleton: true,
})

const { getters, actions } = model

export { getters, actions }

export default model
