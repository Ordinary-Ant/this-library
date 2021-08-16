<template>
  <HeaderNav>
    <template v-slot:default><h5>订单创建</h5></template>
  </HeaderNav>
  <div class="order-container-wrap">
    <div class="order-user">
      <van-contact-card
        v-if="address"
        type="edit"
        :name="address.name"
        :tel="address.phone"
        @click="onEdit"
      />
      <div class="default-content" v-else>
        <span>你还没有填写默认地址，请前往填写</span>
        <van-button round type="success" @click="onEdit">前往填写</van-button>
      </div>
    </div>
    <div class="order-shop">
      <van-card
        v-for="shop in shopCart"
        :key="shop.id"
        :num="shop.num"
        :price="shop.goods.price + '.00'"
        :title="shop.goods.title"
        :thumb="shop.goods.cover_url"
      />
    </div>
    <div class="order-submit">
      <van-submit-bar :price="sumP * 100" button-text="提交订单" @submit="onSubmit" />
    </div>
    <van-popup
      v-model:show="show"
      closeable
      position="bottom"
      :style="{ height: '50%' }"
      round
      @close="onClose"
    >
      <van-grid :border="false" :column-num="2">
        <van-grid-item>
          <h3 class="aliyun-content">支付宝</h3>
        </van-grid-item>
        <van-grid-item>
          <h3 class="wechat-content">微信</h3>
        </van-grid-item>
        <van-grid-item>
          <van-image :src="aliyun" />
        </van-grid-item>
        <van-grid-item>
          <van-image :src="wechat" />
        </van-grid-item>
      </van-grid>
    </van-popup>
  </div>
</template>

<script>
import HeaderNav from 'components/headernav'
import { computed, onMounted, reactive, toRefs, ref } from 'vue'
import { getOrderInfo, createOrder } from 'api/order'
import { getPayOrder, getPayStatus } from 'api/pay'
import { Toast } from 'vant'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'ShopOrderIndex',
  setup () {
    const $router = useRouter()

    const store = useStore()

    const show = ref(false)

    const allInfo = reactive({
      shopCart: [],
      address: null,
      aliyun: '',
      wechat: '',
      id: 0,
      timer: null
    })

    const sumP = computed(() => {
      return allInfo.shopCart.reduce((total, shop) => total + (parseInt(shop.num) * parseFloat(shop.goods.price)), 0)
    })

    const onEdit = () => {
      $router.push('/address')
    }

    const onClose = () => {
      $router.push({ path: '/orderdetail', query: { id: allInfo.id } })
      clearInterval(allInfo.timer)
    }

    const onSubmit = () => {
      createOrder({ address_id: allInfo.address.id }).then(res => {
        Toast.success('创建订单成功')
        store.dispatch('getShopCartNum')
        show.value = true
        allInfo.id = res.id
        // 获取二维码
        getPayOrder(allInfo.id, 'aliyun').then(res => {
          allInfo.aliyun = res.qr_code_url
          allInfo.wechat = res.qr_code_url
        })
        // 轮询查询是否支付，如支付则查询状态
        allInfo.timer = setInterval(() => {
          getPayStatus(allInfo.id).then(res => {
            if (res === 2) {
              clearInterval(allInfo.timer)
              $router.push({ path: '/orderdetail', query: { id: allInfo.id } })
            }
          })
        }, 2000)
      })
    }

    onMounted(() => {
      Toast.loading('加载中')
      getOrderInfo().then(res => {
        allInfo.address = res.address.filter(n => n.is_default === 1)[0]
        allInfo.shopCart = res.carts
        Toast.clear()
      })
    })

    return {
      onEdit,
      ...toRefs(allInfo),
      onSubmit,
      sumP,
      show,
      onClose
    }
  },
  components: {
    HeaderNav
  }
}
</script>

<style lang="scss">
.order-container-wrap{
  margin-top: 50px;
  margin-bottom: 50px;
  .order-shop{
    margin-top: 10px;
    .van-card{
      background: #fff;
      box-shadow: 0 0 10px rgba(0,0,0,.3);
      margin-bottom: 20px;
      .van-card__content{
        text-align: left;
        .van-card__title{
          height: 40px;
          font-size: 16px;
          line-height: 40px;
          font-weight: bold;
        }
        .van-card__bottom{
          font-size: 20px;
          padding: 10px;
          .van-card__price{
            font-size: 16px;
            color: red;
            font-weight: bold;
            .van-card__price-integer{
              font-size: 20px;
            }
          }
        }
      }
    }
  }
  .van-submit-bar{
    margin-bottom: 50px;
  }
}
.default-content{
  font-size: 15px;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  span{
    padding: 10px;
  }
}
.default-content::before {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 0.05333rem;
    background: -webkit-repeating-linear-gradient(135deg,#ff6c6c 0,#ff6c6c 20%,transparent 0,transparent 25%,var(--van-primary-color) 0,var(--van-primary-color) 45%,transparent 0,transparent 50%);
    background: repeating-linear-gradient(-45deg,#ff6c6c 0,#ff6c6c 20%,transparent 0,transparent 25%,var(--van-primary-color) 0,var(--van-primary-color) 45%,transparent 0,transparent 50%);
    background-size: 2.13333rem;
    content: '';
}
.van-overlay{
  z-index: 9999;
}
.aliyun-content,.wechat-content{
  width: 150px;
  height: 50px;
  line-height: 50px;
  margin-top: 25px;
  margin-bottom: -12px;
  border-radius: 20px;
  box-shadow: 1px 1px 5px rgba(0,0,0,.2);
}
</style>
