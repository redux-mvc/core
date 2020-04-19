# createModule(model)

Helper.

Applies `addEvents`, `addReducer` and `addCreateStore` in that order to create a module.

## Arguments

1. `model: ModelInterface`

## Return value

```js
ModuleInterface: {
    ...model,
    reducer(state, action) {...},
    createStore({ bridgeMiddleware }) {},
    emit(event, ...params) {...},
    on(event, handler) {...},
}

```
