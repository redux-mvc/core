# addCreateStore()(module)

Mixes the `createStore` method so that the `createContext` provider can receive the store object.

## Use

Should be executed after all the middleware is setup.

```js
const newModule = R.compose(
    addCreateStore(),
    ...
    addSagaMiddleware(),
    ...
    addEvents(),
)(module)

```

## Return value

```js
ModuleInterface: {
    ...module,
    createStore({ bridgeMiddleware }) {...}
}

```

## Methods

### createStore({ bridgeMiddleware })

Returns the store object.

Arguments

1. `bridgeMiddleware: Middleware`:

  The middleware responsible for observing the global store. 
  It is passed by the `createContext` provider.
