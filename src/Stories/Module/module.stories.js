import React from "react"
import { storiesOf } from "@storybook/react"

import Definition from "./Definition/Layout.js"
import DefinitionDocs from "./Definition/README.md"

import Composition from "./Composition/Layout.js"
import CompositionDocs from "./Composition/README.md"

import Instances from "./Instances/Layout.js"
import InstancesDocs from "./Instances/README.md"

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
    .add("Composition", () => <Composition />, {
        readme: {
            content: CompositionDocs,
        },
    })
    .add("Instances", () => <Instances />, {
        readme: {
            content: InstancesDocs,
        },
    })
