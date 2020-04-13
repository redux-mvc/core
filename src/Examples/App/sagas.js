import * as R from "ramda"
import { eventChannel } from "redux-saga"
import { put, fork, all, take, call } from "redux-saga/effects"

import { actions } from "./model"

const watchNavigate = function*() {
    const history = window.history
    for (;;) {
        const {
            payload: { href },
        } = yield take(actions.navigate.type)

        yield call(
            [history, history.pushState],
            {
                ...history.state,
                page: R.pathOr(-1, ["state", "page"]) + 1,
            },
            "",
            href
        )
    }
}

const locationChanges = () =>
    eventChannel(emitter => {
        window.addEventListener("popstate", emitter)

        return () => {
            window.removeEventListener("popstate", emitter)
        }
    })

const watchLocationChanges = function*() {
    const locationChan = yield call(locationChanges)

    for (;;) {
        yield take(locationChan)
        yield put(actions.setLocationStr(window.location.pathname))
    }
}

const rootSaga = function*() {
    yield put(actions.setLocationStr(window.location.pathname))
    yield all([fork(watchNavigate), fork(watchLocationChanges)])
}

export default rootSaga
