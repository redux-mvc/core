# actions.actionCreator(payload, props, error)

Creates an `ActionPayload` out of parameters

The signature is

```ts
(payload: Any, props?: Object, error?: Any) -> ActionPayload
```

## Arguments

1. `payload` (Any):

   Any information that should be comunicated through the action


2. `props` (Object):

   Aditional info that should be sent in the `ActionPayload`. E.g.: `meta`, `optimist`...

   **Note:** `meta.instanceId` is used by `redux-mvc` to specify the target instance of the `action`

3. `error` (Boolean):

  * default value: `false`

   Specify if there was an error or not
