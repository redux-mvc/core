# createContext(definition)(Component)

HOC.

Creates a `redux-mvc` context, making the module store available to the childrens.

## Use

```js
const Page = createContext({
  module
})(PageLayout)

```

## Arguments

  ```ts
  definition = {
    module: ModuleInterface,
    persist?: Boolean,
    contextId?: String | Symbol
  } : DefinitionInterface
  ```

1. `module: ModuleInterface`

  The module to be executed in the context.

2. `persist?: Boolean`

  Persists the *store object* when unmounted.
  
  * Default: `true`

2. `contextId?: String | Symbol`

  Id where the *store object* will be persisted.

  * Default: `Symbol("contextId")`


## Return value

```js
ReactComponent

```
