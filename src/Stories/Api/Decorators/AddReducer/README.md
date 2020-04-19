# addReducer()(module)

Mixes in a reducer created out of all the models reducer functions.

## Use

 Should be executed after merging all the modules:

```js
const newModule = R.compose(
    ...
    addReducer(),
    ...
    merge(counter),
    merge(searchBar)
)(module)

```

## Return value

```js
ModuleInterface: {
    ...module,
    reducer(state, action) {...},
}

```

## Methods

### reducer(previousState, action)

```js
Reducer: (previousState: Object, action: ActionPayload) -> nextState: Object

```

Computes the `nextState` out of the `previousState` and `action`
