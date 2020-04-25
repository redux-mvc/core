# getters.key(state, props)

Returns `key` property from the `state`

The signature of `getters.key` is:

```ts
Getter<key>: (state: Object, props?: Object) -> Pick<state, key>
```

## Arguments

1. `state: Object`

  The module's `state` Object.

2. `props?: Object`

   The only prop that `getters` use is `props.instanceId` to return the `key` from the specified `instanceId`. 
   
   If the `instanceId` is not found, the `getter` will return the `DEFAULT_INSTANCE_ID` slice.

   * Default: `{}`
   
## Special getters

`redux-mvc` will provide 3 special `getters` in case you need them:

1. `getters.instance`

  Will return the entire `instance` object specified by the `instanceId` as props.

2. `getters.namespace`

  Will return the entire `namespace` object.
   
3. `getters.module`

  Same as the `identity` function, it will return the entire module state.
