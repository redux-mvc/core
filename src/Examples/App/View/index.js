import React from "react"
import { createContext, GLOBAL_CONTEXT_ID } from "redux-mvc"

import module from "../index"
import Link from "./Link"
import Route from "./Route"

import TodoMVC from "Examples/TodoMVC/Page/View"

const decorate = createContext({
    module,
    contextId: GLOBAL_CONTEXT_ID,
})

const App = () => (
    <>
        <Route path="/">
            <Link href="/todo-mvc/">TodoMVC</Link>
        </Route>
        <Route path="/todo-mvc/:filter?" Component={TodoMVC} />
    </>
)

export { Link, Route }

export default decorate(App)
