# createModule(model)

Helper.

Applies `addReducer` and `addLifecycle` in that order to create a module.

## Use

Can be executed by itself,

```js
const newModule = creatModule(model)

``` 

or after any other decorator.

```js
const newModule = R.compose(
  creatModule, 
  ...
  addBridge(...),
  merge(searchBar),
  merge(counter)
)(model)

``` 

## Arguments

1. `model: ModelInterface`

## Return value

```js
newModule = {
    ...model,
    reducer(state, action) {...},
    constructor() {}, // creates the store object
    componentWillUnmount() {} // creates the store object
} : ModuleInterface

```
