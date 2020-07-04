import * as R from "ramda"
import createSagaMiddleware from "redux-saga"
import { addReducer, addLifecycle } from "redux-mvc/decorators"

/*

  addSaga decorator

*/

export const addSaga = rootSaga => module => ({
    ...module,
    saga: rootSaga,
})

/*

  In order to use the new decorator *addSagaMiddleware* we need to rewrite
  the addLifecycle and createModule decorators also.

*/

const created = Symbol("created")

export const enhanceLifecycle = () => module => ({
    ...module,
    constructor(props) {
        const { persist = true, moduleInstances, contextId } = props
        let moduleInstance = moduleInstances[contextId]

        if (!moduleInstance[created] || !persist) {
            moduleInstance[created] = true

            moduleInstance.sagas = R.filter(
                R.identity,
                R.append(
                    module.saga,
                    R.map(
                        R.prop("saga"),
                        Object.values(module.dependencies || {})
                    )
                )
            )

            if (moduleInstance.sagas.length) {
                //create saga middleware
                moduleInstance.middleware = {
                    ...moduleInstance.middleware,
                    sagaMiddleware: createSagaMiddleware(),
                }
            }

            moduleInstance = module.constructor(props)
        }

        //run middleware
        if (moduleInstance.sagas.length) {
            moduleInstance.sagaTasks = moduleInstance.sagas.map(saga =>
                moduleInstance.middleware.sagaMiddleware.run(saga)
            )
        }

        return moduleInstance
    },

    componentWillUnmount(props) {
        const { moduleInstances, contextId } = props
        const moduleInstance = moduleInstances[contextId]

        //stop middleware
        if (moduleInstance.sagaTasks) {
            moduleInstance.sagaTasks.forEach(task => task.cancel())
        }
        return module.componentWillUnmount(props)
    },
})

export const createModule = rootSaga =>
    R.compose(
        enhanceLifecycle(),
        addLifecycle(),
        addReducer(),
        addSaga(rootSaga)
    )

export const noop = () => {}
