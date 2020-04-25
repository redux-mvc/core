# connect(selectors, actions, options)(Component)

Hoc.

Connects the *WrappedComponent* to the *module context*. 

## Use

```js
const ConnectedItemList = connect({
   loading: getters.loading,
   items: getItems
}, {
   toggleItem: actions.toggle
})(ItemList)
```

## Arguments

1. `selectors: Map<SelectorFunction> | null`

  The `selectors` that will consume the *state* from the parent *module*.
  
  Each *key* of the `selectors` Map will be injected as *prop* to the *WrappedComponent*.

2. `actions: Map<ActionCreator> | null`

  Each *key* of the `actions` Map will wrapped into the module *dispatch* and injected as *prop* to the *WrappedComponent*.

3. `options.areEqual: Function`

  `areEqual` predicate function will be passed to *React.memo*.
  
## Return value

React Component with injected *selector props*, *action props* and the *instanceId*.

```js
ReactComponent

```
