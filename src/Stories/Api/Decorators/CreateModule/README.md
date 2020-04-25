# createModule(model)

Helper.

Applies `addEvents`, `addReducer` and `addCreateStore` in that order to create a module.

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

**Note:** as `createModule` should be executed after all other *decorators* they will not be able to attatch listeners to the module for lifecycle.

## Arguments

1. `model: ModelInterface`

## Return value

```js
newModule = {
    ...model,
    reducer(state, action) {...},
    createStore({ bridgeMiddleware }) {},
    emit(event, ...params) {...},
    on(event, handler) {...},
} : ModuleInterface

```
