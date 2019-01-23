import {SET_USERS} from "./mutation-types";

export default {
    [SET_USERS](state, users) {
        state.all = users
    }
}