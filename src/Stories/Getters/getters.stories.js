import React from "react"
import { storiesOf } from "@storybook/react"

import Getters from "./Layout.js"
import GettersDocs from "./README.md"

storiesOf("3 - Getters", module)
    .addParameters({
        readme: {
            codeTheme: "atom-one-light",
        },
    })
    .add("Api", () => <Getters />, {
        readme: {
            content: GettersDocs,
        },
    })
