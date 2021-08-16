import { createStore } from 'vuex'
import getters from './getters'
import state from './state'
import mutations from './mutations'
import actions from './actions'
export default createStore({
  state,
  getters,
  mutations,
  actions
})
