<template>
  <HeaderNav>
    <template v-slot:default><h5>账号管理</h5></template>
  </HeaderNav>
  <div class="user-info">
    <div class="user-change">
      <van-cell title="头像" is-link :value="avatar || 'https://img.yzcdn.cn/vant/cat.jpeg'" @click="change('avatar')">
        <img class="change-img" :src="avatar || 'https://img.yzcdn.cn/vant/cat.jpeg'" alt="">
      </van-cell>
      <van-cell title="昵称" is-link :value="name" @click="change('name')"/>
    </div>
    <div class="user-show">
      <van-cell title="邮箱" :value="email"  />
      <van-cell title="手机" :value="phone || '未填写'"  />
      <van-cell title="是否锁定" :value="is_locked ? '已锁定' : '未锁定'"  />
      <van-cell title="创建时间" :value="created_at"  />
    </div>
  </div>
  <div class="change-container" v-if="isShowName || isShowAvatar">
    <div class="change-title"> 修改信息 </div>
    <van-form @submit="onSubmit" v-if="isShowName">
      <van-cell-group inset>
        <van-field
          v-model="state.username"
          name="username"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
      </van-cell-group>
      <van-button round  size="small" block type="primary" native-type="submit">
        提交
      </van-button>
    </van-form>
    <van-uploader v-model="fileList" :after-read="afterRead" multiple v-if="isShowAvatar" />
  </div>
</template>

<script>
import HeaderNav from 'components/headernav.vue'
import { onMounted, reactive, toRefs, ref } from '@vue/runtime-core'
import { getUserDetail, changeName } from 'api/profile'
import { Toast } from 'vant'
export default {
  name: 'AccountIndex',
  setup () {
    const userInfo = reactive({
      name: '',
      email: '',
      phone: '',
      avatar: '',
      is_locked: '',
      created_at: ''
    })

    const state = reactive({
      username: ''
    })

    const isChange = reactive({
      isShowName: false,
      isShowAvatar: false
    })

    const fileList = ref([
    ])

    // 修改昵称
    const onSubmit = (values) => {
      const name = values.username
      if (name) {
        changeName({ name }).then(res => {
          if (res.status === 204) {
            Toast.success('修改成功')
            isChange.isShowName = false
            userInfo.name = name
          }
        })
      }
    }

    // 点击任意修改
    const change = (type) => {
      if (type === 'name') {
        isChange.isShowName = !isChange.isShowName
      } else {
        isChange.isShowAvatar = !isChange.isShowAvatar
      }
    }

    // 上传头像图片
    const afterRead = (file) => {
      // 此时可以自行将文件上传至服务器
      userInfo.avatar = fileList.value[0].content
      Toast.success('修改成功')
      isChange.isShowAvatar = false
    }

    onMounted(() => {
      getUserDetail().then(res => {
        userInfo.name = res.name
        state.username = res.name
        userInfo.email = res.email
        userInfo.phone = res.phone
        userInfo.avatar = res.avatar
        userInfo.is_locked = res.is_locked
        userInfo.created_at = res.created_at
      })
    })

    return {
      ...toRefs(userInfo),
      change,
      state,
      onSubmit,
      ...toRefs(isChange),
      fileList,
      afterRead
    }
  },
  components: {
    HeaderNav
  }
}
</script>

<style lang="scss">
.user-info{
  background-image: #F1F6F9 !important;
  margin-top: 50px;
  .user-change{
    .van-cell{
      height: 60px;
      align-items: center;
    }
  }
  .change-img{
    width: 50px;
    height: 50px;
    border-radius: 10px;
  }
  .user-show{
    margin-top: 10px;
  }
  .van-cell{
    background-color: transparent;
    border-top: none;
    border-bottom: 1px #e5e5e5 solid;
    width: 95%;
    margin: 0 auto;
    .van-cell__title{
      text-align: left;
    }
  }
}
.change-container{
  margin: 30px auto 0;
  width: 86%;
  background-image: linear-gradient(-225deg, #FFFEFF 0%, #D7FFFE 100%);
  border-radius: 20px;
  border: 1px transparent solid;
  box-shadow: 0 0 8px 0 rgba(232,237,250,.6),0 2px 4px 0 rgba(232,237,250,.5);
  .change-title{
    font-size: 22px;
    font-weight: bold;
    margin: 10px auto;
    color: #666;
  }
  .van-form{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 10px 20px;
    .van-cell-group{
      margin-left: 0;
      background: transparent !important;
      .van-cell__title{
        width: 24%;
      }
      .van-cell{
        background: transparent !important;
        padding-left: 0;
        padding-right: 0;
      }
    }
    .van-button{
      width: 20%;
      background-image: linear-gradient(-225deg, #9EFBD3 0%, #57E9F2 48%, #45D4FB 100%);
      border: transparent;
    }
  }
}
</style>
