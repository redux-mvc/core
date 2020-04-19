import React from "react"
import { storiesOf } from "@storybook/react"

import AddEventsDocs from "./AddEvents/README.md"
import AddReducerDocs from "./AddReducer/README.md"
import AddCreateStoreDocs from "./AddCreateStore/README.md"
import MergeDocs from "./Merge/README.md"
import BridgeDocs from "./AddBridge/README.md"
import CreateModuleDocs from "./CreateModule/README.md"

storiesOf("Decorators Api", module)
    .addParameters({
        readme: {
            codeTheme: "atom-one-light",
        },
    })
    .add("addEvents", () => <div />, {
        readme: {
            content: AddEventsDocs,
        },
    })
    .add("addReducer", () => <div />, {
        readme: {
            content: AddReducerDocs,
        },
    })
    .add("addCreateStore", () => <div />, {
        readme: {
            content: AddCreateStoreDocs,
        },
    })
    .add("merge", () => <div />, {
        readme: {
            content: MergeDocs,
        },
    })
    .add("addBridge", () => <div />, {
        readme: {
            content: BridgeDocs,
        },
    })
    .add("createModule", () => <div />, {
        readme: {
            content: CreateModuleDocs,
        },
    })
