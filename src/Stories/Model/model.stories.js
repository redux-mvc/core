import React from "react"
import { storiesOf } from "@storybook/react"

import IniState from "./IniState/Layout.js"
import IniStateDocs from "./IniState/README.md"

import Reducer from "./Reducer/Layout.js"
import ReducerDocs from "./Reducer/README.md"

storiesOf("1 - Model", module)
    .addParameters({
        readme: {
            codeTheme: "atom-one-light",
        },
    })
    .add("Initial State, getters and setters", () => <IniState />, {
        readme: {
            content: IniStateDocs,
        },
        id: "Model/IniState",
    })
    .add("Reducer", () => <Reducer />, {
        readme: {
            content: ReducerDocs,
        },
        id: "Model/Reducer",
    })
