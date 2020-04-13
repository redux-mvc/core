import React from "react"
import * as R from "ramda"
import { connect } from "redux-mvc"

import { getRenderRoute } from "../selectors"
import { getters } from "../model"

const decorate = connect({
    render: getRenderRoute,
    locationStr: getters.locationStr,
})

const Empty = R.always(null)

const Route = ({ render, Component, NotFound = Empty, children, ...props }) => {
    if (!render) {
        return <NotFound />
    }
    if (Component) {
        return <Component {...props}>{children}</Component>
    }
    return React.cloneElement(children, props)
}

export default decorate(Route)
