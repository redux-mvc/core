# Actions

- Action creators take `payload`, `props` and `error` as params.

```js
(payload: any, props: object, error: boolean) -> ActionPayload

ActionPayload {
   ...props,
   type: string;
   payload: object;
   error: boolean;
}
```

## E.g.:

<!-- STORY -->
