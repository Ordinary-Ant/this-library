<template>
  <header class="head-container">
    <div class="head-left">
      <slot name="left">
        <i @touchend="goback" class="iconfont icon-subdirectory-left"></i>
      </slot>
    </div>
    <div class="head-center"><slot></slot></div>
    <div class="head-right">
      <slot name="right">
        <i @touchend="goSearch" class="iconfont icon-sousuo"></i>
      </slot>
    </div>
  </header>
</template>

<script>
import { useRouter } from 'vue-router'
export default {
  name: 'HeaderNavIndex',
  setup () {
    const $router = useRouter()

    function goback () {
      $router.back()
    }

    function goSearch () {
      $router.push('/search')
    }

    return {
      goback,
      goSearch
    }
  }
}
</script>

<style lang="scss">
  .head-container{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 375px;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 99999;
    background-image: linear-gradient(to right, #acb6e5 , #86fde8 );
    box-shadow: 0 1px 20px rgba(0,0,0,.5);
    color: var(--color-background);
  }
  .head-center{
    flex: 1;
  }
  .head-left,.head-right{
    height: 100%;
    line-height: 40px;
    text-align: center;
    width: 20%;
  }
  .head-container i {
    font-size: 14px;
  }
  .head-container .head-right i{
    font-size: 16px;
    font-weight: bold;
  }
</style>
