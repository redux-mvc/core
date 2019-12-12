# createModel

Creates a `redux-mvc` model: reducer, getters, setters and actions

## Arguments

1. `definition` (object): 

  ```ts
  {
    iniState?: Object,
    reducers?: Object,
    namespace: String
  }
  ```

  * `iniState: Object`
 
    Defines the initial state of the namespace. It will act as default if an instance is not found. Also `redux-mvc` will create a `getter` and `setter` for each key in the iniState object.

  * `reducers: Object`
  
    Defines the reducers of the namespace. `redux-mvc` will create an action with the same name for each key in the reducers object.

    The reducer signature

    ```ts
    (state: Object, action: ActionPayload) -> Partial<state>
    ```
    
    `redux-mvc` will shallow merge the returned partial state to the previous state.
