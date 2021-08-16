<template>
  <HeaderNav>
    <template v-slot:default><h5>订单详情</h5></template>
  </HeaderNav>
  <div class="detail-container">
    <div class="detail-status">
      <div class="status-container">
        <p>订单编号：<span>{{ order_no }}</span></p>
        <p>订单状态：<span>{{ status }}</span></p>
        <div class="status-click">
          <van-button v-if="!(paystatus > 1)" round size="large" type="primary" @click="goPay">去支付</van-button>
          <van-button v-else-if="paystatus === 2" round size="large" type="primary" @click="confirmPay">已支付</van-button>
          <van-button v-else-if="paystatus === 3" round size="large" type="primary" @click="confirmPay">确认收货</van-button>
          <van-button v-else-if="paystatus === 4" round size="large" type="primary" @click="confirmPay">已收货</van-button>
          <van-button v-else-if="paystatus === 5" round size="large" type="primary" @click="confirmPay">已过期</van-button>
        </div>
      </div>
    </div>
    <div class="detail-shop">
      <van-card
        v-for="shop in goods"
        :key="shop.id"
        :num="shop.num"
        :price="shop.price + '.00'"
        :title="shop.goods.title"
        :thumb="shop.goods.cover_url"
      />
      <p>实付款<span>￥{{ amount + '.00' }}</span></p>
    </div>
    <div class="detail-info">
      <h5>订单信息</h5>
      <div class="info-container">
        <p>订单编号：<span>{{ order_no }}</span></p>
        <p>收获地址：<span>{{ address }}</span></p>
        <p>快递类型：<span>普通快递</span></p>
        <p>支付时间：<span>{{ paytime }}</span></p>
        <p>支付类型：<span>{{ paytype }}</span></p>
        <p>快递单号：<span>{{ trade_no }}</span></p>
      </div>
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
import { useRoute } from 'vue-router'
import { reactive, toRefs, ref } from '@vue/reactivity'
import { computed, onMounted } from '@vue/runtime-core'
import { getOrderById, confirmExpress } from 'api/order'
import { getPayOrder, getPayStatus } from 'api/pay'
import { Dialog, Toast } from 'vant'
export default {
  name: 'OrderIndex',
  setup () {
    const $route = useRoute()

    const show = ref(false)

    const state = reactive({
      address: '',
      paystatus: '',
      paytime: '',
      order_no: '',
      paytype: '',
      trade_no: '',
      amount: 0,
      goods: [],
      aliyun: '',
      wechat: '',
      id: '',
      timer: null
    })

    const status = computed(() => {
      const smap = ['', '未支付', '已支付', '已发货', '已确认收货', '已过期']
      return smap[state.paystatus]
    })

    const goPay = () => {
      // 获取二维码
      show.value = true
      getPayOrder(state.id, 'aliyun').then(res => {
        state.aliyun = res.qr_code_url
        state.wechat = res.qr_code_url
      })
      // 轮询查询是否支付，如支付则查询状态
      state.timer = setInterval(() => {
        getPayStatus(state.id).then(res => {
          if (res === 2) {
            clearInterval(state.timer)
            init()
          }
        })
      }, 2000)
    }

    const init = () => {
      Toast.loading('加载中')
      const { id } = $route.query
      state.id = id
      getOrderById(id, { include: 'user,orderDetails.goods,address' }).then(res => {
        state.address = res.address.province + '-' + res.address.city + '-' + res.address.county
        state.order_no = res.order_no
        state.paytype = res.pay_type
        state.paytime = res.pay_time
        state.trade_no = res.trade_no
        state.goods = res.orderDetails.data
        state.paystatus = res.status
        state.amount = res.amount
        Toast.clear()
      })
    }

    const onClose = () => {
      clearInterval(state.timer)
      init()
    }

    const confirmPay = () => {
      Dialog.confirm({ title: '是否确认收货?' }).then(() => {
        confirmExpress(state.id).then(res => {
          Toast.success('已确认收货')
          init()
        }).catch(err => {
          Toast.fail(err.message)
        })
      })
    }

    onMounted(() => {
      init()
    })

    return {
      ...toRefs(state),
      status,
      show,
      onClose,
      goPay,
      confirmPay
    }
  },
  components: {
    HeaderNav
  }
}
</script>

<style lang="scss">
.detail-container{
  margin-top: 40px;
}
.detail-status{
  height: 140px;
  background-image: linear-gradient(to right, #acb6e5 , #86fde8 );
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .status-container{
    height: 120px;
    width: 90%;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,.1);
    padding: 15px;
    p{
      font-size: 15px;
      text-align: left;
      margin-bottom: 3px;
    }
    .status-click{
      margin-top: 10px;
      display: flex;
      justify-content: space-around;
      .van-button{
        border: none;
        box-shadow: 0 0 5px rgba(0,0,0,.1);
        background-image: linear-gradient(to right, #acb6e5 , #86fde8 );
      }
    }
  }
}
.detail-shop{
  margin-top: 10px;
  background: #fafafa;
  box-shadow: 0 0 10px rgba(0,0,0,.1);
  .van-card__content{
    text-align: left;
    padding: 10px;
    .van-card__title{
      font-size: 16px;
      height: 20px;
      line-height: 20px;
      font-weight: bold;
    }
  }
  .van-card__price{
    color: red;
    font-weight: bold;
    font-size: 18px;
    .van-card__price-integer{
      font-size: 20px;
    }
  }
  p{
    text-align: right;
    font-size: 15px;
    padding: 5px 10px;
    font-weight: bold;
    span{
      color: red;
    }
  }
}
.detail-info{
  margin-top: 10px;
  background: #fafafa;
  .info-container{
    text-align: left;
    p{
      padding: 0 10px;
      color: #666;
      font-size: 15px;
      height: 22px;
      line-height: 22px;
    }
  }
  h5{
    text-align: left;
    padding: 3px 10px;
    font-size: 18px;
    margin-bottom: 10px;
  }
}
</style>
