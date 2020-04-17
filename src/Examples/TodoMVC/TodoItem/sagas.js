import * as R from "ramda"
import { put, take, select, fork, all } from "redux-saga/effects"

import { actions, getters } from "./model"
import { actions as DataActions } from "TodoMVC/Data/model"

const watchCommit = function*() {
    for (;;) {
        const { meta } = yield take(actions.commit.type)
        const text = yield select(getters.value, {
            instanceId: meta.instanceId,
        })

        if (!R.isEmpty(text)) {
            yield all([
                put(DataActions.edit({ id: meta.instanceId, text }, { meta })),
                put(actions.setValue("", { meta })),
            ])
        }
    }
}

const watchToggle = function*() {
    for (;;) {
        const { meta } = yield take(actions.toggleCompleted.type)
        const id = meta.instanceId
        yield put(DataActions.toggleComplete(id))
    }
}

const rootSaga = function*() {
    yield all([fork(watchCommit), fork(watchToggle)])
}

export default rootSaga
