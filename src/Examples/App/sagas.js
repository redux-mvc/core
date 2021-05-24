import * as R from "ramda"
import { eventChannel } from "redux-saga"
import { put, fork, all, take, call, select } from "redux-saga/effects"

import { actions } from "./model"
import { getFullPath } from "./selectors"

const watchNavigate = function*() {
    const history = window.history
    for (;;) {
        yield take(actions.navigate.type)

        const href = yield select(getFullPath)

        yield call(
            [history, history.pushState],
            {
                ...history.state,
                page: R.pathOr(-1, ["state", "page"], history.state) + 1,
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
        yield put(actions.setHref(R.replace("#", "", window.location.hash)))
    }
}

const rootSaga = function*() {
    yield put(actions.setBase(window.location.pathname))
    yield put(actions.setHref(R.replace("#", "", window.location.hash)))
    yield all([fork(watchNavigate), fork(watchLocationChanges)])
}

export default rootSaga
