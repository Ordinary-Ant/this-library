import { Toast } from 'vant'
import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'
const Home = () => import('views/home/Home.vue')
const Profile = () => import('views/profile/Profile.vue')
const Detail = () => import('views/detail/Detail.vue')
const ShopCart = () => import('views/shopcart/ShopCart.vue')
const Categroy = () => import('views/categroy/Categroy.vue')
const Login = () => import('views/login/Login.vue')
const Address = () => import('views/address/Address.vue')
const Caddress = () => import('views/address/Caddress.vue')
const ShopOrder = () => import('views/order/ShopOrder.vue')
const Order = () => import('views/order/Order.vue')
const OrderDetail = () => import('views/order/OrderDetail.vue')
const Account = () => import('views/account/Account.vue')
const Favour = () => import('views/favour/Favour.vue')
const Search = () => import('views/search/Search.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Home'
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      title: 'Profile',
      isAuthorization: true
    }
  },
  {
    path: '/detail',
    name: 'Detail',
    component: Detail,
    meta: {
      title: 'Detail'
    }
  },
  {
    path: '/shopcart',
    name: 'ShopCart',
    component: ShopCart,
    meta: {
      title: 'ShopCart',
      isAuthorization: true
    }
  },
  {
    path: '/categroy',
    name: 'Categroy',
    component: Categroy,
    meta: {
      title: 'Categroy'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: 'Login'
    }
  },
  {
    path: '/address',
    name: 'Address',
    component: Address,
    meta: {
      title: 'address',
      isAuthorization: true
    }
  },
  {
    path: '/caddress',
    name: 'Caddress',
    component: Caddress,
    meta: {
      title: 'address',
      isAuthorization: true
    }
  },
  {
    path: '/shoporder',
    name: 'ShopOrder',
    component: ShopOrder,
    meta: {
      title: 'shoporder',
      isAuthorization: true
    }
  },
  {
    path: '/order',
    name: 'Order',
    component: Order,
    meta: {
      title: 'order',
      isAuthorization: true
    }
  },
  {
    path: '/orderdetail',
    name: 'OrderDetail',
    component: OrderDetail,
    meta: {
      title: 'orderdetail',
      isAuthorization: true
    }
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
    meta: {
      title: 'Account',
      isAuthorization: true
    }
  },
  {
    path: '/search',
    name: 'Search',
    component: Search,
    meta: {
      title: 'Sccount'
    }
  },
  {
    path: '/favour',
    name: 'Favour',
    component: Favour,
    meta: {
      title: 'Favour',
      isAuthorization: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  // console.log(store.state.isLogin)
  if (to.meta.isAuthorization && store.state.isLogin === 0) {
    Toast.fail('你还未登录')
    next('/login')
  } else {
    next()
  }
  // document.title = to.meta.title
})

router.afterEach((to, from) => {
  document.title = to.meta.title
})

export default router
