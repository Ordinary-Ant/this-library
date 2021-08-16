import { CHANGE_LOGIN, GET_SHOPCARTNUM } from './mutations-type'
export default {
  [CHANGE_LOGIN] (state, status) {
    state.isLogin = status
  },

  [GET_SHOPCARTNUM] (state, count) {
    state.currentCartShopNum = count
  }
}
