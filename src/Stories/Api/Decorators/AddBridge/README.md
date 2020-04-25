# addBridge({ observedDomains, dispatchToGlobal })(module)

Mixes the `observedDomains` array and the `dispatchToGlobal` filter function, that will later be used by the bridgeMiddleware.


## Use

Should be executed after any `merge` decorator if you want to override the default `observedDomains` and `dispatchToGlobal`.

  ```ts
  const newModule = R.compose(
      addBridge({ observedDomains, dispatchToGlobal })
      ...
      merge(searchBar),
  )(module)

  ```

## Arguments

1. `observedDomains?: Array<String>`

   The array of namespace dependencies from the *global context*.

1. `dispatchToGlobal?: (action: ActionPayload) -> Boolean`

   This predicate function will be used by the `bridgeMiddleware` to forward actions to the *global context*.

## Return value

  ```ts
  newModule = {
      ...module,
      observedDomains,
      dispatchToGlobal,
  } : ModuleInterface

  ```
