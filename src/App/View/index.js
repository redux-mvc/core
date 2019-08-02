import { hot } from "react-hot-loader"

import { withReduxMVCContext } from "redux-mvc"

import appModule from "App"

import Layout from "./Layout"

const decorate = withReduxMVCContext({
    module: appModule,
})

export default hot(module)(decorate(Layout))
