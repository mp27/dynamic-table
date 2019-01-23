import Vuex from 'vuex'
import state from './state'
import actions from './actions'
import mutations from './mutations'
import Vue from "vue";

import users from './modules/users'

Vue.use(Vuex);

const store = new Vuex.Store({
    state,
    actions,
    mutations,
    modules: {
        users
    }
})

export default store