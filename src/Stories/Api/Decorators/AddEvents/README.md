# addEvents()(module)

Mixes an event emitter into the module. Adds `on`  and `emit` methods for lifecycle required from the `createContext` provider.


## Use

Should be executed before any decorator that uses the event api.

```js
const newModule = R.compose(
    addSagaMiddleware(),
    ...
    addEvents(),
)(module)

```

## Return value

```js
ModuleInterface: {
    ...module,
    on(event, handler) {...}
    emit(event, ...params) {...}
}

```

## Methods

### emit(event, ...params)

Emits an event of type `event`;

Arguments

1. `event: String`

  The event type.

2. `params: ...Array<Any>`:

  The rest of the parameters will be passed to the event handlers.

### on(event, handler)

Registers a handler for a specific event of type `event`;

Arguments

1. `event: String`:

  The event type.

2. `handler: (...params: Array<Any>) -> Any`:

  The handler function that takes the parameters passed to `emit`.
