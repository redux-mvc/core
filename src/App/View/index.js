import * as R from "ramda"
import React, { useState } from "react"

import { Column, Row } from "./Common"

import CounterModule from "./CounterModule"
import SameDefaultInstance from "./SameDefaultInstance"
import PassInstanceToContext from "./PassInstanceToContext"
import InstanceAsPropsAndContext from "./InstanceAsPropAndContex"

const options = {
    CounterModule: {
        name: "CounterModule",
        view: CounterModule,
    },
    SameDefaultInstance: {
        name: "SameDefaultInstance",
        view: SameDefaultInstance,
    },
    PassInstanceToContext: {
        name: "PassInstanceToContext",
        view: PassInstanceToContext,
        props: { instanceId: "instance1" },
    },
    InstanceAsPropsAndContext: {
        name: "InstanceAsPropAndContext",
        view: InstanceAsPropsAndContext,
        props: { instanceId: "instance1" },
    },
}

const App = () => {
    const [view, setView] = useState("CounterModule")

    return (
        <Column>
            <Row style={{ marginBottom: 20, fontSize: 20, fontWeight: 300 }}>
                <select
                    onChange={e => setView(e.target.value)}
                    value={view}
                    style={{ fontSize: 30 }}
                >
                    {Object.values(options).map(option => (
                        <option value={option.name} key={option.name}>
                            {option.name}
                        </option>
                    ))}
                </select>
            </Row>
            {React.createElement(
                R.pathOr(CounterModule, [view, "view"], options),
                R.pathOr({}, [view, "props"], options)
            )}
        </Column>
    )
}

export default App
