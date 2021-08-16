<template>
  <HeaderNav>
    <template v-slot:default><h5>商品详情{{ id }}</h5></template>
  </HeaderNav>
  <div class="detail-card">
    <van-image
      width="100%"
      lazy-load
      :src="goods.cover_url"
    />
    <van-card
      num="1"
      :price="goods.price + '.00'"
      :desc="goods.description"
      :title="goods.title"
    >
      <template #tags>
        <van-tag plain type="danger">{{ goods.sales > 0 ? '热销' : '新品' }}</van-tag>
      </template>
      <template #footer>
        <button class="iconfont icon-gouwuche detail-cart" @click="$router.push('/shopcart')"><span>购物车</span></button>
        <button class="iconfont detail-favour" :class="isfavour ? 'icon-shoucang' : 'icon-shoucang1'" @click="favourShop(id)"><span>收藏</span></button>
        <van-button type="warning" @click="addCart">加入购物车</van-button>
        <van-button type="danger" @click="immedShop">立即购买</van-button>
      </template>
    </van-card>
  </div>
  <van-tabs v-model:active="active">
    <van-tab title="概述">
      <div class="content" v-html="goods.details"></div>
    </van-tab>
    <van-tab title="热评"></van-tab>
    <van-tab title="相关">
      <GoodsList :cateGoods="likes"></GoodsList>
    </van-tab>
  </van-tabs>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import { onMounted, reactive, ref, toRefs, watch } from 'vue'
import HeaderNav from 'components/headernav.vue'
import { getGoodDetail, favourShopById } from 'api/detail.js'
import { addShopToCart } from 'api/shopping.js'
import GoodsList from 'components/goodslist'
import { Toast } from 'vant'
import { useStore } from 'vuex'
export default {
  name: 'DetailIndex',
  setup () {
    const isfavour = ref(false)

    const active = ref(0)

    const $route = useRoute()

    const $router = useRouter()

    const store = useStore()

    // 商品详情
    const detail = reactive({
      goods: {},
      likes: [],
      id: $route.query.id
    })

    watch(() => $route.query.id, (newId) => {
      if (newId) {
        detail.id = newId
        init()
      }
    })

    // 添加到购物车
    const addCart = () => {
      addShopToCart({ goods_id: detail.id, num: 1 }).then(res => {
        if (res.status === 201 || res.status === 204) {
          Toast.success('商品已经添加')
          store.dispatch('getShopCartNum')
        }
      })
    }

    // 收藏商品
    const favourShop = (id) => {
      favourShopById(id).then(res => {
        if (res.status === 201) {
          isfavour.value = true
          Toast.success('收藏成功')
        }
        if (res.status === 204) {
          isfavour.value = false
          Toast.success('取消成功')
        }
      })
    }

    // 立即购买
    const immedShop = () => {
      addCart()
      setTimeout(() => {
        $router.push('/shopcart')
      }, 2000)
    }

    const init = () => {
      Toast.loading('加载中')
      getGoodDetail(detail.id).then(res => {
        detail.likes = res.like_goods
        detail.goods = res.goods
        Toast.clear()
      })
    }

    onMounted(() => {
      init()
    })

    return {
      ...toRefs(detail),
      active,
      addCart,
      immedShop,
      favourShop,
      isfavour
    }
  },
  components: {
    HeaderNav,
    GoodsList
  }
}
</script>
<style lang="scss">
  .detail-card{
    .van-image{
      margin-top: 40px;
    }
    .van-card{
      text-align: left;
      border-radius: 10px;
      width: 95%;
      background: #fff;
      margin: 0 auto 10px;
      box-shadow: 0 0 5px rgba(0,0,0,.5);
      .van-card__title{
        font-size: 18px !important;
        font-weight: bold;
        height: 20px;
        line-height: 20px;
        margin: 10px 0;
      }
      .van-card__desc{
        font-size: 15px !important;
        padding-left: 8px;
        margin-bottom: 5px;
      }
      .van-tag{
        margin: 0 0 10px 7px;
        border-radius: 5px;
      }
      .van-card__bottom{
        margin: 0 0 10px 7px;
        font-size: 15px;
        .van-card__price{
          font-size: 20px;
          font-weight: bold;
          color: red;
          .van-card__price-integer{
            font-size: 24px;
          }
        }
      }
      .van-button{
        border-radius: 10px;
      }
    }
    .van-card__footer{
      position: relative;
    }
    .detail-favour, .detail-cart{
      position: absolute;
      left: 70px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: none;
      background: #fff;
      color: red;
      font-size: 20px;
      vertical-align: middle;
      margin-right: 20px;
      height: 45px;
      span{
        color: #666;
        font-size: 5px;
        margin-top: 3px;
      }
    }
    .detail-cart{
      color: #666;
      left:10px
    }
  }
  .van-tabs{
    margin-bottom: 50px;
  }
</style>
