# Module Definition

- *Modules* are created by enhancing or decorating a *model*.

<!-- STORY -->

- The minimum module requirements are:

  1. Adding the *reducer*
  2. Adding the *lifeCycle* methods (for creating the store object)
  
  ```js
  const createModule = R.compose(
      addLifecycle(),
      addReducer(),
  )

  ```

  **Note:** remember function composition works from right to left
  
- This `createModule` decorator is exported from *redux-mvc* as well. 

- But as this is just objects and function composition *redux-mvc* gives you the possibility of writing your own `addReducer` and `addLifecycle`, mix them and write your own `createModule`.


