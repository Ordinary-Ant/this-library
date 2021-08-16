<template>
  <HeaderNav>
    <template v-slot:default><h5>登录</h5></template>
  </HeaderNav>
  <div class="login-wrap">
    <div class="login-logo">
      <img src="@/assets/image/logo.png" alt="">
    </div>
    <div class="login-container">
      <div class="login" v-if="show">
        <van-form @submit="onSubmit">
          <van-cell-group inset>
            <van-field
              v-model="login.email"
              name="邮箱"
              label="邮箱"
              placeholder="请输入邮箱"
              :rules="[{ required: true, message: '请填写邮箱' }]"
            />
            <van-field
              v-model="login.password"
              type="password"
              name="密码"
              label="密码"
              placeholder="密码"
              :rules="[
                { validator: validatorPass }
              ]"
            />
          </van-cell-group>
          <div class="btn-container" style="margin: 16px;">
            <van-button round block type="success" native-type="submit">
              登录
            </van-button>
            <van-button round block type="primary" @click="show = false">
              注册
            </van-button>
          </div>
        </van-form>
      </div>
       <div class="register" v-else>
        <van-form @failed="onFailed" @submit="onSubmit">
          <van-cell-group inset>
            <van-field
              v-model="register.name"
              name="用户名"
              label="用户名"
              placeholder="请输入用户名"
              :rules="[{ required: true, message: '请填写用户名' }]"
            />
            <van-field
              v-model="register.password"
              type="password"
              name="密码"
              label="密码"
              placeholder="请输入密码"
              :rules="[{ validator: validatorPass }]"
            />
            <van-field
              v-model="register.password_confirmation"
              type="password"
              name="确认密码"
              label="确认密码"
              placeholder="请输入确认密码"
              :rules="[{ validator: validatorNextPass }]"
            />
            <van-field
              v-model="register.email"
              type="email"
              name="邮箱"
              label="邮箱"
              placeholder="请输入邮箱"
              :rules="[{ validator: validatorEmail }]"
            />
          </van-cell-group>
          <div class="btn-container" style="margin: 16px;">
            <van-button round block type="primary" native-type="submit">
              注册
            </van-button>
            <van-button round block type="success" @click="show = true">
              登录
            </van-button>
          </div>
        </van-form>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderNav from 'components/headernav.vue'
import { useRouter } from 'vue-router'
import { reactive, ref } from '@vue/reactivity'
import { registers, logins } from 'api/profile.js'
import { useStore } from 'vuex'
import { Toast } from 'vant'
export default {
  name: 'LoginIndex',
  setup () {
    const $router = useRouter()

    const store = useStore()

    const show = ref(true)

    const login = reactive({
      email: '',
      password: ''
    })

    const register = reactive({
      name: '',
      password: '',
      password_confirmation: '',
      email: ''
    })

    // 验证规则
    const validatorPass = (val) => {
      if (!val.length) return '请输入密码'
      else if (val.length !== 6) return '密码必须为6个字符'
    }

    const validatorNextPass = (val) => {
      if (!val.length) return '请输入确认密码'
      else if (val.length !== 6) return '密码必须为6个字符'
      else if (val !== register.password) return '两次输入的密码不一致'
    }

    const validatorEmail = (val) => {
      const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (!val.length) return '请输入邮箱'
      else if (!reg.test(val)) return '请输入正确的邮箱格式'
    }

    const onFailed = (err) => {
      console.log(err)
    }

    const onSubmit = () => {
      // 登录/注册
      if (show.value) {
        logins(login).then(res => {
          window.localStorage.setItem('token', res.access_token)
          store.dispatch('changeLoginStatus', 1)
          store.dispatch('getShopCartNum')
          Toast.success('登录成功')
          setTimeout(() => {
            $router.push('/profile')
          }, 1000)
          login.password = ''
        }).catch(err => {
          console.log({ err })
          Toast.fail('邮箱或密码错误')
          login.email = ''
          login.password = ''
        })
      } else {
        registers(register).then(res => {
          if (res.status === 201) {
            Toast.success('注册成功')
            login.email = register.email
            setTimeout(() => {
              show.value = true
            }, 1000)
          }
        }).catch(err => {
          Toast.fail({ err }.err.response.data.errors[Object.keys({ err }.err.response.data.errors)[0]][0])
        })
        setTimeout(() => {
          register.name = ''
          register.password = ''
          register.password_confirmation = ''
          register.email = ''
        }, 2000)
      }
    }

    return {
      login,
      register,
      show,
      onSubmit,
      onFailed,
      validatorPass,
      validatorNextPass,
      validatorEmail
    }
  },
  components: {
    HeaderNav
  }
}
</script>

<style scoped lang="scss">
.login-wrap{
  // margin-top: 40px;
}
.login-logo{
  width: 240px;
  height: 160px;
  position: relative;
  margin: 50px auto 0;
  img{
    width: inherit ;
  }
}
.login-logo::before{
  content: '';
  position: absolute;
  border-radius: 30px;
  width: 200px;
  height: 100px;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: .3;
  box-shadow: 0 0 10px rgba($color: #000000, $alpha: .4);
  background-image: linear-gradient(-225deg, #231557 0%, #44107A 29%, #FF1361 67%, #FFF800 100%);
}
.btn-container{
  display: flex;
  justify-content: space-evenly;
  .van-button{
    width: 40%;
    box-shadow: 0 0 5px rgba(0,0,0,.5);
  }
}
</style>
