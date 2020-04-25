import React from "react"
import { storiesOf } from "@storybook/react"

import ProviderDocs from "./Provider/README.md"
import ConsumerDocs from "./Consumer/README.md"
import UseModelDocs from "./UseModel/README.md"

storiesOf("Context Api", module)
    .addParameters({
        readme: {
            codeTheme: "atom-one-light",
        },
    })
    .add("Provider", () => <div />, {
        readme: {
            content: ProviderDocs,
        },
    })
    .add("Consumer", () => <div />, {
        readme: {
            content: ConsumerDocs,
        },
    })
    .add("UseModel", () => <div />, {
        readme: {
            content: UseModelDocs,
        },
    })
