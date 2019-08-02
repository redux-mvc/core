import React from "react"

import { connect } from "redux-mvc"

import { noop } from "redux-mvc/utils"

import { selectors, actions } from "App/model"

const decorate = connect(
    {
        count: selectors.count,
    },
    { add: () => actions.add() }
)

const App = ({ count = 0, add = noop }) => (
    <div>
        <button onClick={add}>add</button>
        {count}
    </div>
)

export default decorate(App)
