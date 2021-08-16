<template>
  <HeaderNav>
    <template v-slot:default><h5>搜索</h5></template>
    <template v-slot:right>{{ undefined }}</template>
  </HeaderNav>
  <van-search
    v-model="value"
    @update:model-value="getBooks"
    @clear="clearBook"
    shape="round"
    placeholder="请输入搜索关键词"
  />
  <van-empty v-if="!searchBook.data.length" description="空空如也哦" image="search" />
  <div class="search-list">
    <div class="search-item"
      v-for="book in searchBook.data"
      :key="book.id"
      @click="gotoDetail(book.id)"
    >
      <van-card
        :price="book.price + '.00'"
        :desc="book.updated_at"
        :title="book.title"
        :thumb="book.cover_url"
      >
        <template #tags>
          <van-tag plain v-if="book.sales" type="danger">热销</van-tag>
        </template>
      </van-card>
    </div>
  </div>
</template>

<script>
import HeaderNav from 'components/headernav.vue'
import { getSearchData } from 'api/categroy'
import { reactive, ref } from '@vue/reactivity'
import { useRouter } from 'vue-router'
export default {
  name: 'SearchIndex',
  setup () {
    const value = ref('')

    const $router = useRouter()

    const searchBook = reactive({
      timer: null,
      data: []
    })

    // 表单输入时触发
    const getBooks = (value) => {
      clearTimeout(searchBook.timer)
      searchBook.timer = setTimeout(() => {
        getSearchData(value).then(res => {
          searchBook.data = res.goods.data
        })
      }, 500)
      if (value === '') {
        clearTimeout(searchBook.timer)
        searchBook.data = []
      }
    }

    // 表单清空时触发
    const clearBook = () => {
      searchBook.data = []
    }

    const gotoDetail = (id) => {
      $router.push({ path: '/detail', query: { id } })
    }

    return {
      value,
      getBooks,
      searchBook,
      clearBook,
      gotoDetail
    }
  },
  components: {
    HeaderNav
  }
}
</script>

<style lang="scss">
.van-search{
  position: fixed;
  left: 0;
  top: 40px;
  right: 0;
  z-index: 9999;
  .van-search__content{
    box-shadow: 0 0 10px rgba(0, 0, 0, .3) ;
  }
}
.van-empty{
  margin-top: 90px;
}
.search-item:first-child{
  margin-top: 90px;
}
.search-item:last-child{
  margin-bottom: 50px;
}
.search-item{
  .van-card{
    background: #fff;
    .van-card__header{
      height: 100%;
      .van-card__content{
        text-align: left !important;
        font-size: 16px;
        padding: 10px 0 0;
        div{
          .van-card__title,.van-card__desc{
            height: 25px;
            line-height: 25px;
            font-weight: bold;
          }
          .van-card__desc{
            font-size: 14px;
            font-weight: normal;
          }
        }
        .van-card__bottom{
          .van-card__price{
            color: red;
            .van-card__price-integer{
              font-size: 20px;
              font-weight: bold;
            }
            .van-card__price-decimal{
              font-size: 16px;
            }
          }
        }
      }
    }
  }
}
</style>
