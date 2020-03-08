import React from "react"

import Counter from "ui-kit/Counter/View"

const Counters = ({ style = {} }) => (
    <div style={{ display: "flex", flexDirection: "column", ...style }}>
        <Counter />
        <Counter instanceId="apples" style={{ marginTop: 5 }} />
        <Counter instanceId="oranges" style={{ marginTop: 5 }} />
    </div>
)

export default Counters

export const viewCode = `import React from "react"

import Counter from "ui-kit/Counter/View"

const Counters = () => (
    <div>
        <Counter />
        <Counter instanceId="apples" />
        <Counter instanceId="oranges" />
    </div>
)


`
