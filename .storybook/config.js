import * as R from "ramda"

import { addParameters, addDecorator, configure } from "@storybook/react"
import { addReadme } from "storybook-readme"

import hljs from "highlight.js/lib/highlight"
import javascript from "highlight.js/lib/languages/javascript"
import json from "highlight.js/lib/languages/json"

import "highlight.js/styles/atom-one-light.css"

hljs.registerLanguage("javascript", javascript)
hljs.registerLanguage("json", json)

addDecorator(addReadme)
addParameters({
    options: {
        showPanel: false,
    },
    readme: {
        // You can set a code theme globally.
        codeTheme: "atom-one-light",
    },
})

const loaderFn = () => [
    require(`../src/Stories/Model/model.stories.js`),
    require(`../src/Stories/Module/module.stories.js`),
    require(`../src/Stories/Api/Model/model.stories.js`),
    require(`../src/Stories/Api/Decorators/decorators.stories.js`),
]

configure(loaderFn, module)
