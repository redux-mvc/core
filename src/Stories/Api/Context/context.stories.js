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
    .add("createContext", () => <div />, {
        readme: {
            content: ProviderDocs,
        },
    })
    .add("connect", () => <div />, {
        readme: {
            content: ConsumerDocs,
        },
    })
    .add("useModel", () => <div />, {
        readme: {
            content: UseModelDocs,
        },
    })
