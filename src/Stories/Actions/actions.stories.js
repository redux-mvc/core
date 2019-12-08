import React from "react"
import { storiesOf } from "@storybook/react"

import Actions from "./Layout.js"
import ActionsDocs from "./README.md"

storiesOf("2 - Actions", module)
    .addParameters({
        readme: {
            codeTheme: "atom-one-light",
        },
    })
    .add("Api", () => <Actions />, {
        readme: {
            content: ActionsDocs,
        },
    })
