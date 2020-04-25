# merge(rightModule)(leftModule)

Merges `redux-mvc` from right to left:

## Use

Should be executed before `createReducer`.

```js
const newModule = R.compose(
    ...
    createReducer(),
    ...
    merge(searchBar),
)(module)

```

## Return value

```js
newModule = {
    ...leftModule,
    ...rightModule,
    modules: {...left.modules, ...right.modules },
    iniState: { ...left.iniState, ...right.iniState },
    reducers: { ...left.reducers, ...right.reducers },
    dispatchToGlobal, // create default dispatch to global
    observedDomains, // merge all observedDomains
} : ModuleInterface

```
