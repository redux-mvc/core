# addLifecycle()(module)

Adds lifecycle `constructor` and `componentWillUnmount` methods to the *module* for store creation. This methods will be called by the *redux-mvc* `Context` provider.

## Use

Should be executed after all the other decorators.

```js
const newModule = R.compose(
    addLifecycle(),
    ...
    merge(counter)
)(module)

```

## Return value

```js
newModule = {
    ...module,
    constructor() {...},
    componentWillUnmount() {...}
} : ModuleInterface

```

## Methods

### constructor({ moduleInstances, contextId, persist })

Creates the *store* and returns the *moduleInstance*.

Arguments

1. `moduleInstances: Map<ModuleInstance>`

   All the instances of modules keep by the `Provider`.

2. `contextId: Symbol | String`

   The id of the context created by the `Context` provider.

3. `persist?: Boolean`

   Indicates to persist the store object after the `Context` is unmounted.

Return Value

```js
moduleInstance = {
   store: StoreObject
} : ModuleInstance

```

### componentWillUnmount({ moduleInstances, contextId, persist })

Removes the *store* from the *moduleInstance* if `persist` is false.

Arguments

1. `moduleInstances: Map<ModuleInstance>`

   All the instances of modules keep by the `Provider`.

2. `contextId: Symbol | String`

   The id of the context created by the `Context` provider.

3. `persist?: Boolean`

   Indicates to persist the store object after the `Context` is unmounted.
   
   - Default: `true`

Return Value

```js
moduleInstance = {
   store: StoreObject
} : ModuleInstance

```
