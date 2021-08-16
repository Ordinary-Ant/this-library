export default {
  isLogin: window.localStorage.getItem('token') ? 1 : 0,
  currentCartShopNum: 0
}
