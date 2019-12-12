import React from "react"
import { storiesOf } from "@storybook/react"

import Definition from "./Definition/Layout.js"
import DefinitionDocs from "./Definition/README.md"

storiesOf("2 - Module", module)
    .addParameters({
        readme: {
            codeTheme: "atom-one-light",
        },
    })
    .add("Definition", () => <Definition />, {
        readme: {
            content: DefinitionDocs,
        },
    })
