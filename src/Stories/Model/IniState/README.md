# Defining the model

The model will be defined by the initial state and reducers, just like plain redux.

The main difference is that *redux-mvc* will dinamically create *getters* and *actions*.

<!-- STORY -->

## Getters

- For each property key in the initial state a *getter* function will be created:

  ```js
  const model = createModel({
      iniState: {
        count: 0,
      },
      namespace: "Counter",
  })

  const { actions, getters } = model

  export { actions, getters }
  ```

  will generate a count *getter* (selector) to get the count out of the current state

  ```js
  import { getters } from "./model"

  const decorate = connect(
      { count: getters.count },
      ...
  )

  const Counter = ({ 
      count = 0, 
      ...
  }) => (
      <div ...>
          Count: <input value={count} ... />
      </div>
  )
  ```

## Setters

- Similar to the getters, for each property key of the initial state a *setter* function will be created:

  ```js
  const model = createModel({
      iniState: {
        count: 0,
      },
      namespace: "Counter",
  })

  const { actions, getters } = model

  export { actions, getters }
  ```

  will generate a count *setter* (action) to set the count out of the current state

  ```js
  import { actions } from "./model"

  const decorate = connect(
      ...
      {
          setCount: e => actions.setCount(Number(e.target.value)),
      }
  )

  const Counter = ({ 
      setCount = noop, 
      ...
  }) => (
      <div ...>
          Count: <input onChange={setCount} ... />
      </div>
  )
  ```

  **Note:** Check that the *setters* will be prefixed with `set`. E.g.: for the `count` key the *setter* would be `setCount`.
