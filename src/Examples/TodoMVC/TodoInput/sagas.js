import * as R from "ramda"
import { put, take, select, call, all } from "redux-saga/effects"

import { actions, getters } from "./model"
import { actions as DataActions } from "TodoMVC/Data/model"

const uuid = (limit = 100) => Math.floor(Math.random() * limit)

const watchCommit = function*() {
    for (;;) {
        const { meta } = yield take(actions.commit.type)
        const text = yield select(getters.text, { instanceId: meta.instanceId })

        if (!R.isEmpty(text)) {
            const id = yield call(uuid)
            yield all([
                put(DataActions.add({ id, text, completed: false }, { meta })),
                put(actions.setText("")),
            ])
        }
    }
}

export default watchCommit
