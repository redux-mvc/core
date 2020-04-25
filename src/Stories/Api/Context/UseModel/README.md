# useModel(selectors, actions)

Hook.

Consumes the `selectors` and wrapps `actions`.

## Use

```js
const { items, toggleItem } = useModel({
   items: getItems
}, {
   toggleItem: actions.toggle
})
```

## Arguments

1. `selectors: Map<SelectorFunction> | null`

  The `selectors` that will consume the *state* from the parent *module*.
  
  Each *key* of the `selectors` Map will be executed against the *module store*.

2. `actions: Map<ActionCreator> | null`

  Each *key* of the `actions` Map will be wrapped with *module dispatch* function.

## Return value

```js
const modelProps = {
  ...selectorPropsResult: Map<Any>,
  ...wrappedActionProps: Map<Dispatch<ActionCreator>>,
  instanceId: String
} : ModelPropsInterface

```
