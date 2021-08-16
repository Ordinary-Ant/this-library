<template>
  <section class="goods-wrap">
    <GoodsItem v-for="cateGood in cateGoods" :key="cateGood" :cateGood="cateGood"></GoodsItem>
  </section>
</template>

<script>
import GoodsItem from './goodsitem.vue'
export default {
  name: 'GoodsList',
  props: {
    cateGoods: {
      type: Array,
      default () {
        return []
      }
    }
  },
  setup () {
    return {
    }
  },
  components: {
    GoodsItem
  }
}
</script>

<style lang="scss">
  .goods-wrap{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
</style>
