<template>
  <HeaderNav>
    <template v-slot:default><h5>我的收藏</h5></template>
  </HeaderNav>
  <div class="favour-container">
    <div
      class="favour-item"
      v-for="good in allFavour"
      :key="good.id"
    >
      <van-card
        :price="good.goods.price + '.00'"
        :desc="good.goods.description"
        :title="good.goods.title"
        :thumb="good.goods.cover_url"
        @click="gotoDetail(good.goods_id)"
      />
      <div class="good-create-time">{{ good.created_at }}</div>
    </div>
  </div>
</template>

<script>
import HeaderNav from 'components/headernav.vue'
import { onMounted, ref } from '@vue/runtime-core'
import { getUserFavour } from 'api/profile'
import { useRouter } from 'vue-router'
export default {
  name: 'FavourIndex',
  setup () {
    const allFavour = ref([])
    const $router = useRouter()

    const gotoDetail = (id) => {
      $router.push({ path: '/detail', query: { id } })
    }

    onMounted(() => {
      getUserFavour().then(res => {
        allFavour.value = res.data
      })
    })

    return {
      allFavour,
      gotoDetail
    }
  },
  components: {
    HeaderNav
  }
}
</script>

<style lang="scss">
.favour-container{
  margin-top: 50px;
  .favour-item{
    position: relative;
    margin-bottom: 10px;
  }
  .van-card{
    height: 150px;
    background: #fff;
    .van-card__header{
      height: 100%;
      .van-card__thumb{
        height: 100%;
        width: 134px;
      }
      .van-card__content{
        text-align: left !important;
        font-size: 16px;
        padding: 10px 0 0;
        div{
          height: 50px;
          .van-card__title,.van-card__desc{
            height: 25px;
            line-height: 25px;
            font-weight: bold;
          }
          .van-card__desc{
            font-size: 14px;
            font-weight: normal;
          }
        }
        .van-card__bottom{
          .van-card__price{
            color: red;
            .van-card__price-integer{
              font-size: 20px;
              font-weight: bold;
            }
            .van-card__price-decimal{
              font-size: 16px;
            }
          }
        }
      }
    }
  }
  .good-create-time{
    position: absolute;
    font-size: 14px;
    color: #666;
    bottom: 14px;
    right: 10px;
  }
}
</style>
