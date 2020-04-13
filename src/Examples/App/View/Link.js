import React from "react"
import { connect } from "redux-mvc"

import { actions } from "../model"
import { noop } from "../utils"

const decorate = connect(
    null,
    {
        navigate: actions.navigate,
    }
)

const Link = ({ onClick = noop, navigate, children, ...props }) => (
    <a
        onClick={event => {
            event.preventDefault()
            onClick()
            navigate(props)
        }}
        {...props}
    >
        {children}
    </a>
)

export default decorate(Link)
