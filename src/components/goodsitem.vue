<template>
  <div class="goods-item" @click="goDetail">
    <img  v-lazy="cateGood.cover_url" class="goods-img">
    <div class="goods-info">
      <p class="goods-title">{{ cateGood.title }}</p>
      <span class="price">{{ cateGood.price }}</span>
      <span class="collect"><i class="iconfont icon-shoucang_huaban1"></i>{{ cateGood.collects_count }}</span>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
export default {
  name: 'GoodsItem',
  props: {
    cateGood: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  setup (props) {
    const $router = useRouter()

    const goDetail = () => {
      $router.push({ path: '/detail', query: { id: props.cateGood.id } })
    }

    return {
      goDetail
    }
  }
}
</script>

<style lang="scss">
  .goods-item{
    width: 45%;
    position: relative;
    padding-bottom: 40px;
    .goods-img{
      width: 100%;
    }
    .goods-info{
      position: absolute;
      left: 0;
      right: 0;
      bottom: 5px;
      overflow: hidden;
      font-size: 12px;
      color: var(--color-text);
      .goods-title{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom: 3px;
      }
      .price{
        color: var(--color-tint);
        margin-right: 10px;
        font-size: 14px;
      }
    }
  }
</style>
