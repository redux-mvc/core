# Defining the reducer

<!-- STORY -->

## Creating Reducers

- The module reducer will be created out of a collection of reducer functions:

  ```js
  const model = createModel({
      reducers: {
          add: ({ count }) => ({ count: count + 1 }),
          reset: R.always(iniState),
      },
      ...
  })
  ```

- The reducers will take `state` and `action` as parameters, and they will return the partial state to be updated. 

- The returned partial state will be shallow merged with the previous state.

## Actions

*redux-mvc* will also dinamically create one *action creator* for each reducer function.

- Given this model

  ```js
  const model = createModel({
      reducers: {
          add: ({ count }) => ({ count: count + 1 }),
          reset: R.always(iniState),
      },
      ...
  })

  const { actions, getters } = model

  export { actions, getters }
  ```

  `add` and `reset` actions will be dinamically generated and can later be used in views:

  ```js
  import { actions } from "./model"

  const decorate = connect(
      ...
      { add: actions.add, reset: actions.reset }
  )

  const Counter = ({
      add = noop,
      reset = noop,
      ...
  }) => (
      <div ...>
          <button style={{ marginRight: 10 }} onClick={add}>
              add
          </button>
          <button style={{ marginRight: 10 }} onClick={reset}>
              reset
          </button>
          ...
      </div>
  )
  ```
