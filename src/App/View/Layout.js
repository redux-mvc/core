import React from "react"

import { connect } from "redux-mvc"

import { noop } from "redux-mvc/utils"

import { selectors, actions } from "App/model"

const decorate = connect(
    {
        message: selectors.message,
    },
    { sayHello: actions.sayHello }
)

const App = ({ message = "HELLO WORLD", sayHello = noop }) => (
    <div onClick={sayHello}>{message}</div>
)

export default decorate(App)
