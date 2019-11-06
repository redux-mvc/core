import { call, take } from "redux-saga/effects"

import { actions } from "./model"

const rootSaga = function*() {
    for (;;) {
        yield take(actions.create.type)
        yield call([console, console.log], "hello")
    }
}

export default rootSaga
