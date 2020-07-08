import React from "react"
import * as R from "ramda"
import { connect } from "redux-mvc"

import { getRenderRoute } from "../selectors"

const decorate = connect({
    match: getRenderRoute,
})

const Empty = R.always(null)

const Route = ({ Component, NotFound = Empty, children, ...props }) => {
    if (!props.match) {
        return <NotFound />
    }
    if (Component) {
        return (
            <Component match={props.match} {...props}>
                {children}
            </Component>
        )
    }
    return React.cloneElement(children, props)
}

export default decorate(Route)
