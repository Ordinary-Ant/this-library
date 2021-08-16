<template>
  <HeaderNav>
    <template v-slot:default><h5>分类</h5></template>
  </HeaderNav>
  <section class="cate-container">
    <div class="cate-left">
      <van-collapse v-model="activeName" accordion>
        <van-collapse-item
          v-for="siderbar in siderbars"
          :title="siderbar.name"
          :key="siderbar.id"
          :name="siderbar.id"
        >
          <van-sidebar v-model="activeKey">
            <van-sidebar-item
              v-for="sider in siderbar.children"
              :title="sider.name"
              :key="sider.id"
              @click="selectSider(sider.id)"
            />
          </van-sidebar>
        </van-collapse-item>
      </van-collapse>
    </div>
    <div class="cate-right">
      <div class="cate-list-nav">
        <van-tabs v-model:active="active" @click="selectTab">
          <van-tab
            :title="tab.name"
            v-for="tab in tabNav"
            :key="tab.id"
          ></van-tab>
        </van-tabs>
      </div>
      <div class="cate-list">
        <div class="content">
          <van-card
            v-for="book in currentBooks"
            @click="goDetail(book.id)"
            :key="book.id"
            :tag="book.sales >= 10 ? '热销' : '普通'"
            :price="book.price + '.00'"
            :desc="book.updated_at"
            :title="book.title"
            :thumb="book.cover_url"
          />
        </div>
      </div>
    </div>
    <BackTop v-show="isShowBackTop" @goTop="goTop"></BackTop>
  </section>
</template>

<script>
import HeaderNav from 'components/headernav.vue'
import BScroll from 'better-scroll'
import BackTop from 'components/backtop'
import { onMounted, reactive, ref, computed, watchEffect, nextTick } from 'vue'
import { getCateAllData, getAllBookData } from 'api/categroy.js'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'
export default {
  name: 'CategroyIndex',
  setup () {
    const $router = useRouter()

    // 图书列表数据
    const books = reactive({
      sales: { page: 1, list: [] },
      price: { page: 1, list: [] },
      comments_count: { page: 1, list: [] }
    })

    // 计算属性
    const currentBooks = computed(() => {
      return books[currentTab.value].list
    })

    // 折叠面板中选中的项
    const activeName = ref('1')

    // 侧边栏中选中的项
    const activeKey = ref(0)

    // 分类栏标题
    const tabNav = ref([
      { id: 0, name: '销量', yname: 'sales' },
      { id: 1, name: '价格', yname: 'price' },
      { id: 2, name: '评价', yname: 'comments_count' }
    ])

    // 分类栏选中的项
    const active = ref(0)

    // 侧边栏数据
    const siderbars = ref([])

    // 当前选中的分类栏
    const currentTab = ref('sales')

    // 当前选中的侧边栏
    const currentSider = ref(0)

    // scroll对象
    let bscroll = reactive({})

    // 是否显示回到顶部按钮
    const isShowBackTop = ref(false)

    // 点击按钮触发回到顶部事件
    const goTop = () => {
      bscroll.scrollTo(0, 0, 500)
    }

    const goDetail = id => {
      $router.push({ path: '/detail', query: { id } })
    }

    // 点击分类栏触发事件
    const selectTab = (index) => {
      currentTab.value = tabNav.value[index].yname
      nextTick(() => {
        // 重新计算高度
        bscroll && bscroll.refresh()
      })
    }

    // 点击侧边栏触发事件
    const selectSider = (cid) => {
      currentSider.value = cid
      getbooks()
    }

    // 获取图书书籍
    const getbooks = () => {
      getAllBookData('sales', currentSider.value).then(res => {
        books.sales.list = res.goods.data
      })
      getAllBookData('price', currentSider.value).then(res => {
        books.price.list = res.goods.data
      })
      getAllBookData('comments_count', currentSider.value).then(res => {
        books.comments_count.list = res.goods.data
      })
    }

    onMounted(() => {
      Toast.loading('加载中')
      getCateAllData().then(res => {
        siderbars.value = res.categories
        Toast.clear()
      })
      getbooks()

      bscroll = new BScroll(
        document.querySelector('.cate-list'),
        {
          probeType: 3,
          click: true,
          pullUpLoad: true
        }
      )

      // 页面滑动触发事件
      bscroll.on('scroll', (position) => {
        isShowBackTop.value = (-position.y) > 300
      })

      // 拉动触发加载数据
      bscroll.on('pullingUp', () => {
        // 页数+1
        const page = books[currentTab.value].page + 1
        // 再次请求
        getAllBookData(currentTab.value, currentSider.value, page).then(res => {
          books[currentTab.value].list.push(...res.goods.data)
          books[currentTab.value].page += 1
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
      activeName,
      active,
      siderbars,
      activeKey,
      tabNav,
      selectTab,
      currentSider,
      selectSider,
      books,
      getbooks,
      currentBooks,
      bscroll,
      goTop,
      isShowBackTop,
      goDetail
    }
  },
  components: {
    HeaderNav,
    BackTop
  }
}
</script>
<style lang="scss">
  .cate-container{
    display: flex;
    width: 100%;
    height: 100vh;
    margin-top: 40px;
    .cate-left{
      width: 30%;
      margin-top: 40px;
      position: fixed;
      height: 100%;
    }
    .cate-right{
      margin-left: 30%;
      width: 70%;
      .cate-list-nav{
        position: fixed;
        height: 40px;
        width: 70%;
        z-index: 999;
      }
      .van-card__title{
        font-size: 14px;
        font-weight: bold;
      }
      .cate-list{
        position: absolute;
        height: 100vh;
        top: 83px;
        right: 0;
        left: 30%;
        bottom: 60px;
      }
    }
  }
  .van-collapse-item__content{
    padding: 0 15px 0;
    .van-sidebar-item{
      color: var(--color-text);
      font-size: 12px;
      padding: 15px 0;
    }
  }
</style>
