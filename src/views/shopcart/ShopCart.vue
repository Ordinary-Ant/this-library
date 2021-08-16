<template>
  <HeaderNav>
    <template v-slot:default><h5>购物车</h5></template>
  </HeaderNav>
  <div class="shopList-container">
    <van-checkbox-group v-model="checkeds" @change="selectShop" ref="checkboxGroup">
      <van-swipe-cell v-for="shop in list" :key="shop.id">
        <div class="shop-wrap">
          <van-checkbox :name="shop.id"></van-checkbox>
          <div class="shop-img"><img :src="shop.goods.cover_url" alt=""></div>
          <div class="shop-content">
            <h5>{{ shop.goods.title }}</h5>
            <p>${{ shop.goods.price + '.00' }}</p>
          </div>
          <div class="shop-count">
            <span>x{{ shop.goods.stock }}</span>
            <van-stepper
              v-model="shop.num"
              :max="shop.goods.stock"
              theme="round"
              button-size="20"
              disable-input
              @change="changeCount"
              :name="shop.id"
            />
          </div>
        </div>
        <template #right>
          <van-button
            square
            text="删除"
            type="danger"
            class="delete-button"
            @click="deleteS(shop.id)"
          />
        </template>
      </van-swipe-cell>
    </van-checkbox-group>
    <van-empty description="你的购物车中没有商品" v-if="!list.length">
      <van-button round type="success" class="bottom-button" @click="$router.push('/')">前往购物</van-button>
    </van-empty>
  </div>
  <van-submit-bar :price="currentPrice * 100" button-text="结算" @submit="onSubmit">
    <van-checkbox v-model="checked">全选</van-checkbox>
    <!-- <template #tip>
      你的收货地址不支持同城送, <span @click="onClickLink">修改地址</span>
    </template> -->
  </van-submit-bar>
</template>

<script>
import HeaderNav from 'components/headernav.vue'
import { Toast } from 'vant'
import { reactive, ref, toRefs } from '@vue/reactivity'
import { getShopCatList, changeShopCartNum, checkShop, deleteShop } from 'api/shopping'
import { computed, onMounted } from '@vue/runtime-core'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'ShopCartIndex',
  setup () {
    const store = useStore()

    const $router = useRouter()

    const checkboxGroup = ref(null)

    const shopList = reactive({
      list: [],
      checkeds: []
    })

    // 全选功能
    const checked = computed({
      get () {
        return shopList.checkeds.length === shopList.list.length
      },
      set (newV) {
        checkboxGroup.value.toggleAll(newV)
      }
    })

    // 总价格
    const currentPrice = computed(() => {
      return shopList.list.filter(shop => shopList.checkeds.includes(shop.id))
        .reduce((total, shop) => total + (parseInt(shop.num) * parseFloat(shop.goods.price)), 0)
    })

    // 更新选中状态
    const selectShop = (checkeds) => {
      shopList.checkeds = checkeds
      checkShop({ cart_ids: checkeds })
    }

    // 生成订单
    const onSubmit = () => {
      if (shopList.checkeds.length) {
        $router.push('/shoporder')
      } else {
        Toast.fail('请选中你要购买的商品')
      }
    }
    // const onClickLink = () => Toast('修改地址')

    // 修改选中商品的数量数
    const changeCount = (num, shop) => {
      Toast.loading('请稍后...')
      changeShopCartNum(shop.name, num).then(res => {
        Toast.clear()
      })
    }

    // 删除单个商品
    const deleteS = (id) => {
      deleteShop(id).then(res => {
        Toast.loading('请稍后')
        store.dispatch('getShopCartNum')
        init()
        Toast.clear()
      })
    }

    // 初始化
    const init = () => {
      Toast.loading('加载中')
      getShopCatList('goods').then(res => {
        shopList.list = res.data
        shopList.checkeds = res.data.filter(shop => shop.is_checked === 1).map(shop => shop.id)
        Toast.clear()
      })
    }

    onMounted(() => {
      init()
    })

    return {
      onSubmit,
      // onClickLink,
      ...toRefs(shopList),
      changeCount,
      checked,
      checkboxGroup,
      selectShop,
      deleteS,
      currentPrice
    }
  },
  components: {
    HeaderNav
  }
}
</script>

<style lang="scss" scoped>
.van-swipe-cell{
  margin-bottom: 10px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,.3);
}
.shopList-container{
  margin-top: 50px;
  margin-bottom: 110px;
  .shop-wrap{
    height: 120px;
    display: flex;
    align-items: center;
    padding: 10px;
    .van-checkbox{
      margin: 0 10px 0 0;
    }
    .shop-img{
      img{
        width: 100px;
      }
    }
    .shop-content{
      width: 120px;
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      h5{
        margin-bottom: 20px;
        font-size: 15px;
      }
      p{
        overflow:hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 120px;
        font-size: 16px;
        font-weight: bold;
        color: red;
      }
    }
    .shop-count{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex: 1;
      span{
        color: var(--color-text);
        font-size: 14px;
        margin-bottom: 10px;
        margin-left: 50px;
      }
    }
  }
}
.van-submit-bar{
  margin-bottom: 50px;
}
.goods-card {
  margin: 0;
  background-color: #fff;
}
.delete-button {
  height: 100%;
}
</style>
