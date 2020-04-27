# merge(leftModule)(rightModule)

Merges `redux-mvc` modules from right to left:

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
    ...rightModule,
    dependencies: {...left.dependencies, ...right.dependencies },
    iniState: { ...left.iniState, ...right.iniState },
    reducers: { ...left.reducers, ...right.reducers },
} : ModuleInterface

```
