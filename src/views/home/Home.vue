<template>
  <div id="home">
    <HeaderNav>
      <template v-slot:default><h5>首页</h5></template>
    </HeaderNav>
    <BookCategroy v-show="isTabFixed" @getCateIndex="getCateIndex" :titles="cateTitle" :current="currentCate"></BookCategroy>
    <div class="wrapper">
      <div class="content">
        <div class="topnav" ref="top">
          <HomeSwiper :sliders="allData.slides"></HomeSwiper>
          <RecommendGoods :recomGoods="allData.goods"></RecommendGoods>
        </div>
        <BookCategroy @getCateIndex="getCateIndex" :titles="cateTitle" :current="currentCate"></BookCategroy>
        <GoodsList :cateGoods="currentCateList"></GoodsList>
      </div>
    </div>
  </div>
  <BackTop v-show="isShowBackTop" @goTop="goTop"></BackTop>
</template>

<script>
import { computed, onMounted, reactive, ref, nextTick, watchEffect } from 'vue'
import BScroll from 'better-scroll'
import HeaderNav from 'components/headernav'
import RecommendGoods from 'components/recommendgoods'
import BookCategroy from 'components/bookcategroy'
import GoodsList from 'components/goodslist'
import BackTop from 'components/backtop'
import HomeSwiper from 'components/homeswiper'
import { getHomeAllData, getHomeAllCateData } from 'api/index.js'
import { Toast } from 'vant'
export default {
  name: 'HomeIndex',
  setup () {
    // 首页所有图书数据
    const allData = reactive({})

    // 三类图书列表
    const cateData = reactive({
      sales: { page: 1, list: null },
      recommend: { page: 1, list: null },
      new: { page: 1, list: null }
    })

    // 三类图书文本信息
    const cateTitle = reactive([
      { id: 0, name: '畅销', yname: 'sales' },
      { id: 1, name: '精选', yname: 'recommend' },
      { id: 2, name: '新书', yname: 'new' }
    ])

    // 当前选中哪一类图书列表
    const currentCateList = computed(() => {
      return cateData[cateTitle[currentCate.value].yname].list
    })

    // 当前选中哪一类图书的图书
    const currentCate = ref(0)

    // 自定义事件函数
    // 用于接收子组件选中的图书类别
    const getCateIndex = (id) => {
      currentCate.value = id
      // 当页面变化完毕后
      nextTick(() => {
        // 重新计算高度
        bscroll && bscroll.refresh()
      })
    }

    // 点击按钮触发回到顶部事件
    const goTop = () => {
      bscroll.scrollTo(0, 0, 500)
    }

    // 是否显示分类导航条
    const isTabFixed = ref(false)

    // 指向ref为top的元素
    const top = ref(null)

    // 是否显示回到顶部按钮
    const isShowBackTop = ref(false)

    // scroll对象
    let bscroll = reactive({})

    // 页面挂载完毕触发钩子
    onMounted(() => {
      Toast.loading('加载中')
      // 获取所有图书数据
      getHomeAllData().then(res => {
        allData.categories = res.categories
        allData.goods = res.goods
        allData.slides = res.slides
        Toast.clear()
      })

      // 获取三类图书数据
      getHomeAllCateData().then(res => {
        cateData.sales.list = res.goods.data
      })
      getHomeAllCateData('recommend').then(res => {
        cateData.recommend.list = res.goods.data
      })
      getHomeAllCateData('new').then(res => {
        cateData.new.list = res.goods.data
      })

      // 配置scroll:new BScroll(selector,config)
      bscroll = new BScroll(
        document.querySelector('.wrapper'),
        {
          probeType: 3,
          click: true,
          pullUpLoad: true
        }
      )

      // 页面滑动触发事件
      bscroll.on('scroll', (position) => {
        isShowBackTop.value = isTabFixed.value = (-position.y) > top.value.offsetHeight
      })

      // 拉动触发加载数据
      bscroll.on('pullingUp', () => {
        // 页数+1
        const page = cateData[cateTitle[currentCate.value].yname].page + 1
        // 再次请求
        getHomeAllCateData(cateTitle[currentCate.value].yname, page).then(res => {
          cateData[cateTitle[currentCate.value].yname].list.push(...res.goods.data)
          cateData[cateTitle[currentCate.value].yname].page += 1
        })
        bscroll.finishPullUp()
        bscroll.refresh()
      })
    })

    // 监听页面变化
    watchEffect(() => {
      // 当页面变化完毕后
      nextTick(() => {
        // 重新计算高度
        bscroll && bscroll.refresh()
      })
    })

    return {
      allData,
      cateTitle,
      getCateIndex,
      cateData,
      currentCateList,
      isTabFixed,
      top,
      goTop,
      isShowBackTop,
      currentCate
    }
  },
  components: {
    HeaderNav,
    RecommendGoods,
    BookCategroy,
    GoodsList,
    BackTop,
    HomeSwiper
  }
}
</script>

<style lang="scss">
#home{
  height: 100vh;
  position: relative;
  .wrapper{
    position: absolute;
    top: 40px;
    left: 0;
    right: 0;
    bottom: 50px;
    overflow: hidden;
  }
}
</style>
