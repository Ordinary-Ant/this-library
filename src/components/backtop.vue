<template>
  <div class="back-icon iconfont icon-up1" @touchend="backTop"></div>
</template>

<script>
export default {
  name: 'BackTop',
  setup (porps, { emit }) {
    const backTop = () => {
      emit('goTop')
    }
    return {
      backTop
    }
  }
}
</script>

<style lang="scss">
  .back-icon{
    position: absolute;
    bottom: 90px;
    right: 20px;
    background-image: linear-gradient(to right, #acb6e5 , #86fde8 );
    font-size: 30px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    text-align: center;
    z-index: 99;
    box-shadow: 0 0 8px rgba($color: #000000, $alpha: .5);
  }
</style>
