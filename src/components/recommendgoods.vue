<template>
  <section class="recom-book">
    <div class="book-item" v-for="good in recomGoods.data" :key="good.id" @touchend="goDetail(good.id)">
       <img class="book-img"  v-lazy="good.cover_url">
       <span class="book-desc">{{ good.description.split('/')[1].trim() }}</span>
    </div>
  </section>
</template>

<script>
import { useRouter } from 'vue-router'
export default {
  name: 'RecommendGoods',
  props: {
    recomGoods: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  setup () {
    const $router = useRouter()

    function goDetail (id) {
      $router.push({ path: '/detail', query: { id } })
    }

    return {
      goDetail
    }
  }
}
</script>

<style lang="scss">
  .recom-book{
    display: flex;
    flex-wrap: wrap;
    height: 120px;
    width: 375px;
    overflow: hidden;
    margin-top: -5px;
    .book-item{
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 25%;
      height: 100%;
      .book-img{
        height: 80px;
        width: 90px;
      }
      .book-desc{
        font-size: 12px;
      }
    }
  }
</style>
