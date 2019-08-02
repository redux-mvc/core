import { call } from "redux-saga/effects"

const rootSaga = function*() {
    yield call([console, console.log], "hello")
}

export default rootSaga
