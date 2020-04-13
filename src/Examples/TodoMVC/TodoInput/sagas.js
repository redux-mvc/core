import * as R from "ramda"
import { put, take, select, call, all } from "redux-saga/effects"

import { actions, getters } from "./model"
import { actions as DataActions } from "TodoMVC/Data/model"

const uuid = () => Math.floor(Math.random() * 100)

const watchCommit = function*() {
    for (;;) {
        const { meta } = yield take(actions.commit.type)
        const text = yield select(getters.text, { instanceId: meta.instanceId })

        if (!R.isEmpty(text)) {
            const id = yield call(uuid)
            yield all([
                put(DataActions.add({ id, text, completed: false })),
                put(actions.setText("")),
            ])
        }
    }
}

export default watchCommit
