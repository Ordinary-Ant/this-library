<template>
  <section class="book-nav">
    <div
      class="nav-item"
      v-for="title in titles"
      :key="title.id"
      @touchend="getCurrentIndex(title.id)"
      :class="{ active: currentIndex === title.id }"
    >
      <span class="nav-title">{{ title.name }}</span>
    </div>
  </section>
</template>

<script>
import { ref } from '@vue/reactivity'
import { watch } from '@vue/runtime-core'
export default {
  name: 'BookCategroyIndex',
  props: {
    titles: {
      type: Array,
      default () {
        return []
      }
    },
    current: {
      type: Number,
      default: 0
    }
  },
  setup (props, { emit }) {
    const currentIndex = ref(0)

    watch(() => props.current, news => {
      currentIndex.value = news
    })

    const getCurrentIndex = (id) => {
      currentIndex.value = id
      emit('getCateIndex', id)
    }
    return {
      currentIndex,
      getCurrentIndex
    }
  }
}
</script>

<style lang="scss">
  .book-nav{
    // 固定吸附，即设定一个top可以让此类所在的标签固定在top的高度上
    z-index: 999;
    position: sticky;
    top: 40px;
    display: flex;
    width: 100%;
    height: 40px;
    text-align: center;
    font-size: 14px;
    width: 100%;
    color: var(--color-text);
    background-image: linear-gradient(to right, #a8edea 0%, #fed6e3 100%);
    margin-bottom: 10px;
    box-shadow: 0 1px 5px rgba(0,0,0,.3);
    .nav-item{
      flex: 1;
      .nav-title{
        padding: 5px;
        border-bottom: 3px solid transparent;
      }
    }
    .active{
      color: var(--color-tint);
      .nav-title{
        border-bottom: 3px solid var(--color-tint);
      }
    }
  }
</style>
