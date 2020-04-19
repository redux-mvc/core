# createModel(definition)

Creates a `redux-mvc` model: `getters`, `setters` and `action creators`

## Arguments

  `definition: Object` 

  ```ts
  {
    namespace: String,
    iniState?: Object,
    reducers?: Map<ReducerFunction>,
    singleton?: Boolean,
  }
  ```

1. `namespace: String`

  The namespace of the model.

2. `iniState?: Object`

  Defines the initial state of the namespace. It will act as default if an instance is not found. Also `redux-mvc` will create a `getter` and `setter` for each key in the iniState object.

  * Default: `false`.

3. `reducers?: Map<ReducerFunction>`

  Defines the reducers with the folowing signature of the model.

  ```ts
  ReducerFunction: (state: Object, action: ActionPayload) -> Partial<state>
  ```

  `redux-mvc` will shallow merge the returned partial state to the previous state.
  `redux-mvc` will create one *ActionCreator* for each `key` in the `reducers` Map.

  * Default: `{}`.

4. `singleton?: Boolean`

  Defines if the model is singleton. Meaning that every action goes to the default instance, and every getter returns the state of the default instance.

  * Default: `false`

## Return value

  ```ts
  ModelInterface: {
    namespace: String,
    iniState: Object,
    reducers: Map<ReducerFunction>,
    actions: Map<ActionCreator>,
    getters: Map<Getter>,
    namespaces: Array<String>,
    singleton: Boolean,
  }
  ```
