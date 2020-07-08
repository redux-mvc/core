import React from "react"
import { connect } from "redux-mvc"

import { actions } from "../model"
import { noop } from "App/utils"

import { getHashedBase } from "../selectors"

const decorate = connect(
    { base: getHashedBase },
    {
        navigate: actions.navigate,
    },
    { forwardRef: true }
)

const Link = ({ onClick = noop, navigate, children, href, base, ...props }) => (
    <a
        onClick={event => {
            event.preventDefault()
            onClick()
            navigate({ href })
        }}
        href={base + href}
        {...props}
    >
        {children}
    </a>
)

export default decorate(Link)
