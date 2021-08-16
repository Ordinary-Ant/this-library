<template>
  <footer class="nav">
    <nav
      class="nav-item"
      :class="{ 'active-color': navColor === '/' }"
      @touchend="changeColor('/')"
    >
      <div class="nav-icon"><i class="iconfont icon-store-front"/></div>
      <div class="nav-text">首页</div>
    </nav>
    <nav
      class="nav-item"
      :class="{ 'active-color': navColor === '/categroy' }"
      @touchend="changeColor('/categroy')"
    >
      <div class="nav-icon"><i class="iconfont icon-view-tile"/></div>
      <div class="nav-text">分类</div>
    </nav>
    <nav
      class="nav-item"
      :class="{  'active-color': navColor === '/shopcart' }"
      @touchend="changeColor('/shopcart')"
    >
      <div class="nav-icon">
        <van-badge :content="currentCartShopNum" max="9">
          <i class="iconfont icon-shopping-cart"/>
        </van-badge>
      </div>
      <div class="nav-text">购物车</div>
    </nav>
    <nav
      class="nav-item"
      :class="{ 'active-color': navColor === '/profile' }"
      @touchend="changeColor('/profile')"
    >
      <div class="nav-icon"><i class="iconfont icon-user"/></div>
      <div class="nav-text">我的</div>
    </nav>
  </footer>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'
import { watch, ref, onMounted } from 'vue'
import { useStore, mapState } from 'vuex'
export default {
  name: 'FooterNavIndex',
  setup () {
    // 路由
    const $router = useRouter()
    const $route = useRoute()

    const store = useStore()

    // 记录点击的路由
    const navColor = ref('/')

    watch(() => $route.path, (newroute) => {
      navColor.value = newroute
    })

    // 修改导航样式为激活状态
    function changeColor (routerUrl) {
      navColor.value = routerUrl
      $router.push(navColor.value)
    }

    onMounted(() => {
      if (window.localStorage.getItem('token')) {
        // console.log(111)
        store.dispatch('getShopCartNum')
      }
    })
    return {
      navColor,
      changeColor
    }
  },
  computed: {
    ...mapState(['currentCartShopNum'])
  }
}
</script>

<style lang="scss">
  .nav{
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    width: 375px;
    background-color: #F6F6F6;
    font-size: var(--font-size);
    color: var(--color-text);
    box-shadow: 0 -1px 20px rgba(0,0,0,.3);
    z-index: 99999;
  }
  .nav-item{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .nav-item .nav-text{
    margin-top: 6px;
  }
  .active-color{
    color: var(--color-high-text);
  }
</style>
