import { call, take } from "redux-saga/effects"

import { actions } from "App/model"

const rootSaga = function*() {
    for (;;) {
        yield take(actions.add.type)
        yield call([console, console.log], "hello")
    }
}

export default rootSaga
