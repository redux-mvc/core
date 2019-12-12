# Module Definition

- *Modules* are created by enhancing or decorating a *model*.

<!-- STORY -->

- The minimum module requirements are:

  1. Adding an *emit* and *on* methods for module lifecycle
  2. Adding the *reducer*
  3. Adding a *createStore* method

  ```js
  const createModule = R.compose(
      addReducer(),
      addCreateStore(),
      addEvents()
  )

  ```

  **Note:** remember function composition works from right to left

