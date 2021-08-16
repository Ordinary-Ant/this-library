import { CHANGE_LOGIN, GET_SHOPCARTNUM } from './mutations-type'
import { getShopCatList } from 'api/shopping'
export default {
  changeLoginStatus ({ commit }, status) {
    commit(CHANGE_LOGIN, status)
  },

  async getShopCartNum ({ commit }) {
    const result = await getShopCatList()
    if (result) {
      commit(GET_SHOPCARTNUM, result.data.length)
    }
  }
}
