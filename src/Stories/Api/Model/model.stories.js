import React from "react"
import { storiesOf } from "@storybook/react"

import ModelDocs from "./CreateModel/README.md"
import ActionsDocs from "./Actions/README.md"
import GettersDocs from "./Getters/README.md"

storiesOf("Model Api", module)
    .addParameters({
        readme: {
            codeTheme: "atom-one-light",
        },
    })
    .add("createModel", () => <div />, {
        readme: {
            content: ModelDocs,
        },
    })
    .add("actions", () => <div />, {
        readme: {
            content: ActionsDocs,
        },
    })
    .add("getters", () => <div />, {
        readme: {
            content: GettersDocs,
        },
    })
