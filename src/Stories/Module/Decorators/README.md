# Module Decorators

Decorators are *model* or *module* enhancers. They allow to add functionalities to the model.

The decorator api is:

```js
(options: any) => (module | model: object) => module

```

## Included *redux-mvc* Decorators

### addEvents

- Adds `emit` and `on` methods
- *redux-mvc* will emit `start` and `stop` events when the module is started and stopped respectively

