# Module Instances

- *Modules* can be rendered with different instances, allowing a module to be reused many times in one screen while keeping it's own state per instance.

<!-- STORY -->

- There's 3 ways to work with instances:

  1. No instance, then the module will use the default instance

  ```js
const Counters = () => (
    <div>
        <Counter />
        ...
    </div>
)

  ```

  2. Constant instance

  ```js
const Counters = () => (
    <div>
        <Counter instanceId="apples" />
        <Counter instanceId="oranges" />
        ...
    </div>
)

  ```

  3. Dynamic instance

  ```js
const Counters = ({ instances = []}) => (
    <div>
    { 
      R.map(
        instance => <Counter instanceId={instance} />, 
        instances
      ) 
    }
    </div>
)

  ```
