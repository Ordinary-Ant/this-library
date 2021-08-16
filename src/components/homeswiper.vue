<template>
  <van-swipe v-if="sliders.length" class="my-swipe" :autoplay="3000" indicator-color="white">
    <van-swipe-item v-for="slider in sliders" :key="slider.id">
      <img  v-lazy="slider.img_url">
    </van-swipe-item>
  </van-swipe>
</template>

<script>
export default {
  name: 'HomeSwiper',
  props: {
    sliders: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
img{
  width: 100%;
  height: 160px !important;
}
</style>
