import React from "react"
import { storiesOf } from "@storybook/react"

import IniState from "./IniState/Layout.js"
import IniStateDocs from "./IniState/README.md"

import Reducer from "./Reducer/Layout.js"
import ReducerDocs from "./Reducer/README.md"

storiesOf("1 - Defining the Model", module)
    .addParameters({
        readme: {
            codeTheme: "atom-one-light",
        },
    })
    .add("Initial State, getters and setters", () => <IniState />, {
        readme: {
            content: IniStateDocs,
        },
    })
    .add("Reducer", () => <Reducer />, {
        readme: {
            content: ReducerDocs,
        },
    })
