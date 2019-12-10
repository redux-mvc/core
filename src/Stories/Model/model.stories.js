import React from "react"
import { storiesOf } from "@storybook/react"

import IniState from "./IniState/Layout.js"
import IniStateDocs from "./IniState/README.md"

import Reducer from "./Reducer/Layout.js"
import ReducerDocs from "./Reducer/README.md"

import Actions from "./Actions/Layout.js"
import ActionsDocs from "./Actions/README.md"

import Getters from "./Getters/Layout.js"
import GettersDocs from "./Getters/README.md"

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
    })
    .add("Reducer", () => <Reducer />, {
        readme: {
            content: ReducerDocs,
        },
    })
    .add("Actions Api", () => <Actions />, {
        readme: {
            content: ActionsDocs,
        },
    })
    .add("Getters Api", () => <Getters />, {
        readme: {
            content: GettersDocs,
        },
    })
