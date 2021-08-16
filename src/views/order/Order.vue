<template>
  <HeaderNav>
    <template v-slot:default><h5>所有订单</h5></template>
  </HeaderNav>
  <div class="tab-conta">
    <van-tabs v-model:active="active" @change="changeStatus">
      <van-tab title="所有"></van-tab>
      <van-tab title="待支付"></van-tab>
      <van-tab title="已支付"></van-tab>
      <van-tab title="已发货"></van-tab>
      <van-tab title="已收货"></van-tab>
      <van-tab title="过期"></van-tab>
    </van-tabs>
    <div id="content">
      <!-- <van-pull-refresh v-model="refreshing" @refresh="onRefresh"> -->
        <van-list
          style="height:79%;width:100%;overflow-y:auto;"
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          :immediate-check="false"
          :offset="1"
        >
          <div class="shop-order van-clearfix" v-for="order in list" :key="order.id">
            <div class="createLook">
              <div class="createTime">创建时间：{{ order.created_at }}</div>
              <van-button round type="primary" size="mini" @click="$router.push({ path: '/orderdetail', query: { id: order.id } })">查看订单</van-button>
            </div>
            <van-card
              v-for="shop in order.orderDetails.data"
              :key="shop.id"
              :num="shop.num"
              :price="shop.price + '.00'"
              :title="shop.goods.title"
              :thumb="shop.goods.cover_url"
            />
            <div class="orderAmount">
              <div class="orderNo">订单编号：{{ order.order_no }}</div>
              <div class="amount">总金额:<span>￥{{order.amount + '.00'}}</span></div>
            </div>
          </div>
        </van-list>
      <!-- </van-pull-refresh> -->
    </div>
  </div>
</template>

<script>
import HeaderNav from 'components/headernav'
import { ref, reactive, toRefs, onMounted } from 'vue'
import { listOrder } from 'api/order'
export default {
  name: 'OrderIndex',
  setup () {
    const active = ref(0)

    const state = reactive({
      list: [],
      loading: false,
      finished: false,
      // refreshing: false,
      page: 1
    })

    const onLoad = () => {
      listOrder({ page: state.page, status: active.value, include: 'orderDetails.goods' }).then(res => {
        state.list = state.list.concat(res.data)
        state.page += 1
        state.loading = false
        // console.log(res)
        if (!res.data.length) {
          state.finished = true
        }
      })
    }

    const onRefresh = () => {
      // console.log(222)
      // 清空列表数据
      state.finished = false

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      state.loading = true
      // 加载数据
      onLoad()
    }

    const changeStatus = (name) => {
      active.value = name
      state.list = []
      state.page = 1
      onRefresh()
    }

    onMounted(() => {
      onRefresh()
    })

    return {
      active,
      ...toRefs(state),
      onLoad,
      onRefresh,
      changeStatus
    }
  },
  components: {
    HeaderNav
  }
}
</script>

<style lang="scss">
.tab-conta{
  margin-top: 40px;
  .van-tabs{
    width: 100vm;
    .van-tabs__wrap{
      box-shadow: 0 1px 5px rgba(0,0,0,.2);
    }
  }
}
.shop-order{
  margin: 10px auto 10px;
  box-shadow: 0 0 10px rgba(0,0,0,.2);
  border-radius: 10px;
  padding: 5px;
  width: 95%;
  .createLook{
    height: 30px;
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
    color: #666;
    line-height: 30px;
    font-size: 15px;
    .van-button{
      margin-top: 3px;
      background-image: linear-gradient(-225deg, #231557 0%, #44107A 29%, #FF1361 67%, #FFF800 100%);
      box-shadow: 0 0 5px rgba(0,0,0,.2);
      border: none;
    }
  }
  .van-card{
    margin-top: 0;
    background: #fff;
    margin-bottom: 5px;
    text-align: left;
    padding-top: 0;
    padding-bottom: 0;
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
  }
  .orderAmount{
    height: 30px;
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
    color: #666;
    line-height: 30px;
    font-size: 13px;
    .amount{
      span{
        color: red;
        font-weight: bold;
      }
    }
  }
}
#content{
  height: 100%;
  position: fixed;
  top: 85px;
  left: 0;
  right: 0;
  bottom: 50px;
  width: 100%;
  .van-list{
    bottom: 50px;
  }
}
</style>
