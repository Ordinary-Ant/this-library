<template>
  <HeaderNav>
    <template v-slot:default><h5>地址管理</h5></template>
  </HeaderNav>
  <section class="address-list-wrap">
    <van-address-list
      v-model="chosenAddressId"
      :list="list"
      disabled-text="以下地址超出配送范围"
      default-tag-text="默认"
      @add="onAdd"
      @edit="onEdit"
    />
  </section>
</template>

<script>
import HeaderNav from 'components/headernav'
// import { Toast } from 'vant'
import { ref } from '@vue/reactivity'
import { useRouter } from 'vue-router'
import { getAllAddInfo } from 'api/address'
import { onMounted } from '@vue/runtime-core'
import { Toast } from 'vant'
export default {
  name: 'AddressIndex',
  setup () {
    const $router = useRouter()

    const chosenAddressId = ref('1')
    const list = ref([])

    onMounted(() => {
      Toast.loading('加载中')
      getAllAddInfo().then(res => {
        if (res.data.length) {
          list.value = res.data.map(item => {
            return {
              id: item.id,
              name: item.name,
              tel: item.phone,
              address: `${item.province} ${item.city} ${item.county} ${item.address}`,
              isDefault: item.is_default
            }
          })
        }
        Toast.clear()
      })
    })

    const onAdd = () => $router.push('/caddress')
    const onEdit = (item) => {
      $router.push({ path: '/caddress', query: { type: 'edit', addressId: item.id } })
    }

    return {
      chosenAddressId,
      list,
      onAdd,
      onEdit
    }
  },
  components: {
    HeaderNav
  }
}
</script>

<style lang="scss">
.address-list-wrap{
  margin-top: 50px;
  .van-button{
    border: none;
    color: #fff;
    background-image: linear-gradient(-225deg, #FF057C 0%, #7C64D5 48%, #4CC3FF 100%);
  }
}
.van-address-item{
  box-shadow: 0 0 10px rgba(0, 0, 0, .3);
}
.van-address-list__bottom{
  margin-bottom: 60px;
}
</style>
