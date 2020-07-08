
# redux-mvc
  
  Alternative react bindings framework for React and Redux.
  
  Modular, composable, reusable. 
  
  [Docs](https://redux-mvc.github.io/docs)

  [Examples](https://redux-mvc.github.io/docs/examples)
  
[![build status](https://circleci.com/gh/redux-mvc/core/tree/master.svg?style=shield)](https://app.circleci.com/pipelines/github/redux-mvc/core?branch=master)
[![npm version](https://img.shields.io/npm/v/@redux-mvc/core.svg?style=flat-square)](https://www.npmjs.com/package/@redux-mvc/core)
[![npm downloads](https://img.shields.io/npm/dm/@redux-mvc/core.svg?style=flat-square)](https://www.npmjs.com/package/@redux-mvc/core)
  
## Installation

    # If you use npm:
    npm install @redux-mvc/core

    # Or if you use Yarn:
    yarn add @redux-mvc/core
  
## Motivations

   - Make an analogy with traditional MVC architecture.
   - Bring back separation of concerns.
   - redux is great for separation of concerns and reducing complexity, but is not modular and composable by default. Then is very hard to reuse.
   - Chop big redux state trees and make atomic modules.
   - Reduce the boilerplate around creating reducers, actionCreators, selectors, and wiring it all together.
   - Show the value of using a general but safe framework that enforces certain architecture choices.
   - Make a modular framework to be able to customize it to your needs.
   - Modules run when the module context component is constructed, not before like redux. 
   - Bring back code splitting for redux.

