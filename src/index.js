import React from "react"
import ReactDOM from "react-dom"

import App from "App/View"

const root = document.createElement("div")
root.style.height = "100vh"
root.style.overflow = "hidden"
document.body.appendChild(root)

ReactDOM.render(<App />, root)
