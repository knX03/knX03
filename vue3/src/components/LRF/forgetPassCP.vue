<script setup>
import {getCurrentInstance, ref} from "vue";
import axios from "axios";
import {ElMessage, ElNotification} from "element-plus";
import router from "@/router/index.js";
import {aGenerateCode, aUserForget} from "@/api/api.js";

/* (跨域请求是否提供凭据信息(cookie、HTTP认证及客户端SSL证明等))
axios.defaults.withCredentials = true
*/
let ctx = getCurrentInstance()
let sendCodeBT = ref(false)
let loading = ref(false)
let buttonSwitch = ref(false)
let active = ref(0)
let forgetForm = ref({
  user_Email: '',
  code: '',
  user_Password: '',
  checkPass: '',
},)
let validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码!'));
  } else if (value.length < 8) {
    callback(new Error('密码最短长度为8位!'));
  } else {
    callback();
  }
}
let validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码!'));
  } else if (value !== forgetForm.value.user_Password) {
    callback(new Error('两次输入密码不一致!'));
  } else {
    callback();
  }
}

const rules = ref({
  user_Email: [
    {required: true, message: '请输入邮箱地址', trigger: 'blur'},
    {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
  ],
  code: [
    {required: true, message: '验证码不能为空'},
  ],
  user_Password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {validator: validatePass, trigger: 'blur'}
  ],
  checkPass: [
    {required: true, message: '请再次输入密码', trigger: 'blur'},
    {validator: validatePass2, trigger: 'blur'}
  ],
})

/*下一步*/
function nextStep() {
  if (active.value++ > 2) active.valuee = 0;
}

/*上一步*/
function returnStep() {
  if (active.value-- <= 0) active.value = 0;
}

/*验证邮箱*/
function verifyEmail() {
  axios({
    method: 'POST',
    url: 'http://localhost/user/ifExist',
    data: forgetForm.value
  }).then(resp => {
    if (resp.data.code === 301) {
      buttonSwitch.value = true
      ElNotification({
        title: '提示信息',
        message: "邮箱不存在，请输入已注册的邮箱！",
        type: 'error'
      })
    } else {
      buttonSwitch.value = false
    }
  })
}

/*发送验证码*/
function sendCode() {
  if (forgetForm.value.user_Email.length === 0) {
    ElNotification({
      title: '提示信息',
      message: "邮箱为空，请先输入邮箱！",
      type: 'error',
      duration: 2000
    })
    return;
  }
  buttonSwitch.value = true
  ElMessage('正在发送验证码，请前往填写的邮箱处查看！')
  let codeBT_mod = document.querySelector(".codeBT_mod"); //获取验证码按钮
  sendCodeBT.value = true;
  let time = 59;
  let timer = setInterval(function () {
    // 判断剩余秒数
    if (time === 0) {
      // 清除定时器和复原按钮
      clearInterval(timer);
      sendCodeBT.value = false;
      codeBT_mod.innerHTML = '获取验证码';
    } else {
      codeBT_mod.innerHTML = `${time}秒后重发`;
      time--;
    }
  }, 1000);
  aGenerateCode(forgetForm.value).then(resp => {
    if (resp.data.code === 200) {
      buttonSwitch.value = false
    } else if (resp.data.code === 400) {
      buttonSwitch.value = false
      active.value = 1
      ElNotification({
        title: '提示信息',
        message: resp.data.msg,
        type: 'error'
      })
    }
  })
}

function submitUser() {
  /*跳转等待时间,单位毫秒*/
  const TIME_COUNT = 2000;
  active.value = 0
  loading.value = true;
  aUserForget(forgetForm.value).then(resp => {
    if (resp.data.code === 200) {
      ElNotification({
        title: '提示信息',
        message: resp.data.msg + "2秒后跳转！",
        type: 'success'
      })
      setTimeout(() => {
        loading.value = false;
        router.push({path: '/signIn',})
      }, TIME_COUNT)
    } else if (resp.data.code === 300) {
      loading.value = false;
      active.value = 0
      ElNotification({
        title: '提示信息',
        message: "验证码有误，请重新输入！",
        type: 'error'
      })
    } else {
      console.log(resp.data.msg)
    }
  })
}
</script>

<template>
  <div class="page_mod">
    <div class="forgetBlock_mod" v-loading="false"
         element-loading-text="重置密码中"
         element-loading-spinner="el-icon-cloudy"
         element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <div class="fmod1">
        <div class="logo_mod">
          <router-link to="/">
            <img src="/src/photos/logo/AUT.png"/>
          </router-link>
        </div>
        <span class="FLoginLink_mod">
        如果你想要登录,请点击->
        <router-link to="/signIn">登录</router-link>
      </span>
      </div>
      <!--验证身份表单-->
      <div class="VerifyEmail_mod" v-show="active===0">
        <el-form :model="forgetForm" :rules="rules" label-width="100px" class="demo-dynamic">
          <el-form-item
              prop="user_Email"
              label="邮箱"
          >
            <el-input v-model="forgetForm.user_Email" @blur="verifyEmail"></el-input>
          </el-form-item>

          <div class="code_mod">
            <el-form-item label="验证码" prop="code"
            >
              <el-input v-model="forgetForm.code"></el-input>
            </el-form-item>
            <el-button class="codeBT_mod" @click="sendCode" type="warning" plain :disabled="sendCodeBT">发送验证码
            </el-button>
          </div>
        </el-form>
      </div>
      <!--设置密码表单-->
      <div class="setPass_mod" v-show="active===1">

        <el-form :model="forgetForm" :rules="rules" label-width="100px"
                 class="demo-ruleForm">
          <el-form-item label="密码" prop="user_Password">
            <el-input type="password" v-model="forgetForm.user_Password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="forgetForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>

      </div>

      <div class="returnButton_mod">
        <el-button @click="returnStep" v-show="active>=1">上一步</el-button>
      </div>
      <div class="nextButton_mod">
        <el-button type="primary" @click="nextStep" v-show="active===0" :disabled="buttonSwitch">下一步</el-button>
      </div>
      <div class="submitButton_mod">
        <el-button type="primary" @click="submitUser" v-show="active===1">完成</el-button>
      </div>
    </div>
  </div>
</template>

<style src="../css/LRF/forgetPass.css"></style>
<style scoped>
</style>