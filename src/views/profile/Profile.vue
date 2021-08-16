<template>
  <HeaderNav>
    <template v-slot:default><h5>个人</h5></template>
  </HeaderNav>
  <div class="profile-card-wrap">
    <van-image
      round
      width="2.3rem"
      height="2.2rem"
      :src="info.avatar || 'https://img.yzcdn.cn/vant/cat.jpeg'"
    />
    <div class="profile-content">
      <p>昵称：{{ info.name }}</p>
      <p>登录名：{{ info.email }}</p>
      <p>个性签名：这个人很懒，他什么都没写</p>
    </div>
  </div>
  <div class="profile-list">
    <van-cell is-link title="我的收藏" @click="go('/favour')" />
    <van-cell is-link title="我的订单" @click="go('/order')" />
    <van-cell is-link title="账号管理" @click="go('/account')" />
    <van-cell is-link title="地址管理" @click="go('/address')" />
    <van-cell is-link title="关于我们" @click="shows = true" />
    <van-action-sheet v-model:show="shows" title="标题">
      <div class="content">内容</div>
    </van-action-sheet>
  </div>
  <van-button type="success" @click="logout">退出</van-button>
</template>

<script>
import HeaderNav from 'components/headernav.vue'
import { useRouter } from 'vue-router'
import { logouts, getUserDetail } from 'api/profile.js'
import { Toast } from 'vant'
import { useStore } from 'vuex'
import { reactive, ref, toRefs } from '@vue/reactivity'
import { onMounted } from '@vue/runtime-core'
export default {
  name: 'ProfileIndex',
  setup () {
    const $router = useRouter()

    const store = useStore()

    const shows = ref(false)

    const user = reactive({
      info: {}
    })

    const logout = () => {
      logouts().then(res => {
        if (res.status === 204) {
          window.localStorage.removeItem('token')
          store.dispatch('changeLoginStatus', 0)
          store.state.currentCartShopNum = 0
          Toast.success('退出成功')
          setTimeout(() => {
            $router.push('/login')
          }, 1000)
        }
      })
    }

    const go = (add, query) => {
      $router.push(add)
    }

    onMounted(() => {
      getUserDetail().then(res => {
        user.info = res
      })
    })

    return {
      logout,
      shows,
      ...toRefs(user),
      go
    }
  },
  components: {
    HeaderNav
  }
}
</script>

<style scoped lang="scss">
.profile-card-wrap{
  width: 90%;
  height: 120px;
  border-radius: 20px;
  box-shadow: 0 0 10px rgba(0,0,0,.3);
  margin: 50px auto 20px;
  display: flex;
  align-items: center;
  padding: 10px;
  background-image: linear-gradient(-225deg, #69EACB 0%, #EACCF8 48%, #6654F1 100%);
  .van-image{
    border: 1px solid transparent;
    box-shadow: 0 0 20px rgba($color: #000, $alpha: .3);
    margin-left: 20px;
    margin-right: 20px;
  }
  .profile-content{
    width: 180px;
    color: #fff;
    font-size: 15px;
    text-align: left;
    p{
      height: 25px;
      line-height: 25px;
      overflow:hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.profile-list{
  width: 90%;
  border-radius: 5px;
  height: auto;
  margin: 0 auto;
  .van-cell{
    height: 60px;
    display: flex;
    align-items: center;
    text-align: left !important;
  }
}
.van-button{
  width: 90%;
  border-radius: 50px;
  background-image: linear-gradient(-225deg, #FF057C 0%, #7C64D5 48%, #4CC3FF 100%);
  border: none;
  margin-top: 20px;
  box-shadow: 0 0 10px 1px rgba(0,0,0,.3);
}
.content {
  padding: 16px 16px 160px;
}
</style>
