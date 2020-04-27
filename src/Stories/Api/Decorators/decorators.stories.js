import React from "react"
import { storiesOf } from "@storybook/react"

import AddReducerDocs from "./AddReducer/README.md"
import AddLifecycleDocs from "./AddLifecycle/README.md"
import MergeDocs from "./Merge/README.md"
import BridgeDocs from "./AddBridge/README.md"
import CreateModuleDocs from "./CreateModule/README.md"

storiesOf("Decorators Api", module)
    .addParameters({
        readme: {
            codeTheme: "atom-one-light",
        },
    })
    .add("addReducer", () => <div />, {
        readme: {
            content: AddReducerDocs,
        },
    })
    .add("addLifecycle", () => <div />, {
        readme: {
            content: AddLifecycleDocs,
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
