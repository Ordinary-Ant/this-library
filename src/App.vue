<template>
  <!-- vue3 kepp-alive用法：使用插槽的方式 -->
  <!-- <router-view v-slot="{ Component }">
    <keep-alive exclude="/detail">
      <component :is="Component"/>
    </keep-alive>
  </router-view> -->
  <router-view />
  <FooterNav/>
</template>

<script>
import FooterNav from 'components/footernav.vue'
export default {
  components: {
    FooterNav
  }
}
</script>

<style lang="scss">
@import "assets/css/base.css";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
html {
  overflow: hidden;
  height: 100%;
}
body {
  height: 100%;
  overflow: auto;
}
</style>
