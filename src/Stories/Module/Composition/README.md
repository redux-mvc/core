# Module Composition

- *Modules* can be composed together to *reuse* different functionalities.

<!-- STORY -->

- To mix a module in follow this steps:

  1. Use the *merge* utility from *redux-mvc*
  2. Continue creating the module as usual 

  ```js
  const CounterAndSearchbar = R.compose(
      createModule,
      ...
      merge(counter),
      merge(searchBar)
  )(model)

  ```

  **Note:** remember function composition works from right to left

