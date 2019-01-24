import {SET_USERS} from "./mutation-types";
import UserAPI from '@/API/users'

export default {
    getAllUsers({commit}, payload) {
        // we should do a real request to an api, while sending params for pagination
        return UserAPI.all(payload).then((response) => {
            commit(SET_USERS, response)
        }).catch((error) => {
            // in our case will never fail
            Promise.reject(error);
        });

    }
}