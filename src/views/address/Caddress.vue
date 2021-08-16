<template>
  <HeaderNav>
    <template v-slot:default><h5>{{ type === 'add' ? '添加地址' : '编辑地址' }}</h5></template>
  </HeaderNav>
  <section class="address-add-wrap">
    <van-address-edit
      :area-list="areaList"
      :address-info="addressInfo"
      :show-delete="type==='edit'"
      show-set-default
      show-search-result
      :search-result="searchResult"
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
      @delete="onDelete"
      @change-detail="onChangeDetail"
    />
  </section>

</template>

<script>
import HeaderNav from 'components/headernav'
import { onMounted, reactive, ref } from 'vue'
import { Toast } from 'vant'
import { areaList } from '@vant/area-data'
import { addAddress, getAddInfo, updateAddInfo, deleteAddInfo } from 'api/address'
import { useRoute, useRouter } from 'vue-router'
export default {
  name: 'CaddressIndex',
  setup () {
    const searchResult = ref([])

    const $router = useRouter()

    const $route = useRoute()

    // 地址初始信息
    const addressInfo = reactive({})

    // 默认为添加地址状态
    const type = ref('add')

    onMounted(() => {
      Toast.loading('加载中')
      if ($route.query && $route.query.type === 'edit') {
        type.value = $route.query.type
        getAddInfo($route.query.addressId).then(res => {
          const info = res
          if (info) {
            addressInfo.name = info.name
            addressInfo.tel = info.phone
            addressInfo.province = info.province
            addressInfo.city = info.city
            addressInfo.county = info.county
            addressInfo.addressDetail = info.address
            addressInfo.isDefault = info.is_default > 0
            addressInfo.areaCode = Object.entries(areaList.county_list).find(item => item[1].includes('东城区'))[0]
          }
        })
        Toast.clear()
      }
    })

    const onSave = (adddetail) => {
      console.log(adddetail.isDefault ? 1 : 0)
      const data = {
        name: adddetail.name,
        address: adddetail.addressDetail,
        phone: adddetail.tel,
        province: adddetail.province,
        city: adddetail.city,
        county: adddetail.county,
        is_default: adddetail.isDefault ? 1 : 0
      }
      if (type.value === 'add') {
        addAddress(data).then(res => {
          if (res.status === 201) {
            Toast.success('添加成功')
            setTimeout(() => {
              $router.back()
            }, 1000)
          } else if (res.status === 422) {
            Toast.fail('格式错误，请重新输入')
          }
        })
      } else if (type.value === 'edit') {
        updateAddInfo($route.query.addressId, data).then(res => {
          if (res.status === 204) {
            Toast.success('保存成功')
            setTimeout(() => {
              $router.back()
            }, 1000)
          } else if (res.status === 422) {
            Toast.fail('格式错误，请重新输入')
          }
        })
      }
    }

    const onDelete = () => {
      deleteAddInfo($route.query.addressId).then(res => {
        if (res.status === 204) {
          Toast.success('删除成功')
          $router.back()
        } else {
          Toast.fail('删除失败，请重试')
        }
      })
    }

    const onChangeDetail = (val) => {
      console.log(val)
    }

    return {
      onSave,
      onDelete,
      areaList,
      searchResult,
      onChangeDetail,
      addressInfo,
      type
    }
  },
  components: {
    HeaderNav
  }
}
</script>

<style lang="scss">
.address-add-wrap{
  margin-top: 50px;
  .van-button{
    border: none;
    color: #fff;
    background-image: linear-gradient(-225deg, #FF057C 0%, #7C64D5 48%, #4CC3FF 100%);
  }
  .van-cell__title{
    text-align: left;
  }
}
</style>
