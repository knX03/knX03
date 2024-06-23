<script setup>
import {getCurrentInstance, ref} from "vue";
import axios from "axios";
import {ElMessage, ElNotification} from "element-plus";
import router from "@/router/index.js";
import {Cloudy, PartlyCloudy, Sunny} from "@element-plus/icons-vue";
import {aCheckName, aGenerateCode, aUserReg, aVerifyEmail} from "@/api/api.js";

let ctx = getCurrentInstance()
let loading = ref(false)
let buttonSwitch = ref(false)
let active = ref(0)
let userForm = ref({
  user_Name: '',
  user_Sex: '',
  user_Age: '',
  user_Email: '',
  user_Password: '',
  checkPass: '',
  code: '',
},)
let checkAge = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('年龄不能为空'));
  }
  if (!Number.isInteger(value)) {
    callback(new Error('请输入数字值'));
  } else {
    if (value < 0 || value > 200) {
      callback(new Error('年龄过于离谱！'));
    } else {
      callback();
    }
  }
}
let validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码!'));
  } else if (value.length < 8) {
    callback(new Error('密码最短长度为8位!'));
  } else {
    callback();
  }
};
let validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码!'));
  } else if (value !== userForm.value.user_Password) {
    callback(new Error('两次输入密码不一致!'));
  } else {
    callback();
  }
};

const rules = ref({
  user_Name: [
    {required: true, message: '请输入名称！', trigger: 'blur'},
    {min: 2, max: 8, message: '名称长度不应小于2或大于8个字符！', trigger: 'blur'}
  ],
  user_Age: [
    {validator: checkAge, trigger: 'blur'}
  ],
  user_Email: [
    {required: true, message: '请输入邮箱地址', trigger: 'blur'},
    {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
  ],
  user_Password: [
    {validator: validatePass, trigger: 'blur'}
  ],
  checkPass: [
    {validator: validatePass2, trigger: 'blur'}
  ],
})

/*下一步*/
function nextStep() {
  if (active.value++ > 2) active.value = 0;
  if (active.value === 2) {
    loading.value = true
    ElMessage('正在发送验证码，请前往填写的邮箱处查看！')
    aGenerateCode(userForm.value).then(resp => {
      if (resp.data.code === 200) {
        loading.value = false
      } else if (resp.data.code === 400) {
        loading.value = false
        active.value = 1
        ElNotification({
          title: '提示信息',
          message: resp.data.msg,
          type: 'error'
        })
      }
    })
  }
}

/*上一步*/
function returnStep() {
  if (active.value-- <= 0) active.value = 0;
}

/*检查用户名是否存在*/
function checkName(row) {
  aCheckName(row).then(resp => {
    if (resp.data.code === 302) {
      ElMessage.error(resp.data.msg)
      userForm.value.user_Name = ''
    } else if (resp.data.code === 200) {
    }
  })
}

/*验证邮箱*/
function verifyEmail() {
  aVerifyEmail(userForm.value).then(resp => {
    if (resp.data.code === 302) {
      buttonSwitch.value = true
      ElNotification({
        title: '提示信息',
        message: "邮箱已经存在，请尝试更换邮箱或登录！",
        type: 'error'
      })
    } else {
      buttonSwitch.value = false
    }
  })
}

/*监听验证码输入框的变化*/
function submitCode() {
  if (userForm.value.code.length >= 4) {
    submitUser()
  }
}

/*完成注册*/
function submitUser() {
  /*跳转等待时间,单位毫秒*/
  const TIME_COUNT = 3000;
  active.value = 3
  loading.value = true
  aUserReg(userForm.value).then(resp => {
    loading.value = false
    if (resp.data.code === 200) {
      ElNotification({
        title: '提示信息',
        message: "注册成功!3秒后跳转！",
        type: 'success'
      })
      setTimeout(() => {
        router.push({path: '/signIn',})
      }, TIME_COUNT)
    } else if (resp.data.code === 402) {
      ElNotification({
        title: '提示信息',
        message: resp.data.data,
        type: 'error'
      })
    } else if (resp.data.code === 300) {
      userForm.value.code = '';
      active.value = 2
      ElNotification({
        title: '提示信息',
        message: "验证码有误，请重新输入！",
        type: 'error'
      })
    }
  })
}

/*验证码输入框*/
window.addEventListener('load', () => {
  // 获取元素
  const codeItem = document.querySelectorAll('.code-item')
  const codeInput = document.querySelector('.code-input')
  // 循环显示input中的值到code-item中
  const showNum = () => {
    // 获取到当前input的值
    const curVal = codeInput.value
    // 循环显示到code-item中
    Array.from(codeItem).map((item, index) => {
      curVal[index] ?
          item.innerText = curVal[index] :
          item.innerText = ''
    })
  }

  // 处理active类的增删
  const cutAct = (type) => {
    // 获取当前input中值的长度
    const valLenth = codeInput.value.length
    // 首先清除之前的active类名
    Array.from(codeItem).map(item => {
      item.className = 'code-item'
    })
    // 当type为focus时 进行计算active位置 否则只清除
    if (type === 'focus') {
      // 计算出当前应该active的code-item 并且给他添加active类名
      // 因为input的值有4个长度，他的长度是从1开始的；
      // 而codeItem位数组，下标为0，从0开始的，所以当input长度为4时，对应的codeItem其实是不存在的 所以我们需要减一
      codeItem[valLenth === 4 ? valLenth - 1 : valLenth].className = 'code-item active'
    }
  }

  // 为输入框添加事件
  codeInput.addEventListener('focus', () => {
    // 聚焦时 计算active的code-item
    cutAct('focus')
  })

  codeInput.addEventListener('blur', () => {
    // 失去焦点时 移除当前的active
    cutAct('blur')
  })

  codeInput.addEventListener('input', () => {
    // 当输入值时，调用循环显示函数
    showNum()
    cutAct('focus')
    /*    if (codeInput.value.length === 4) {
          submitUser()
        }*/
  })
})

</script>

<template>
  <div class="Page_mod">
    <div class="registerBlock_mod"
         v-loading="loading"
         element-loading-text="注册中"
         element-loading-spinner="el-icon-sunny"
         element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <div class="sumod1">
        <div class="logo_mod">
          <router-link to="/">
            <img src="/src/photos/logo/AUT.png"/>
          </router-link>
        </div>
        <span class="suLoginLink_mod">
          如果你已经有账户了,请点击->
          <router-link to="/signIn">登录</router-link>
        </span>
      </div>
      <div class="StepBar">
        <el-steps :active="active" finish-status="success" align-center>
          <el-step title="信息" :icon="Cloudy"></el-step>
          <el-step title="账户" :icon="PartlyCloudy"></el-step>
          <el-step title="验证" :icon="Sunny"></el-step>
        </el-steps>
      </div>

      <!--注册表单-->
      <div class="registerForm_mod">
        <div class="BasicInfo_mod" v-show="active===0">
          <el-form
              ref="userFormRef"
              :model="userForm"
              label-width="80px"
              :rules="rules"
              status-icon
          >
            <el-form-item label="名称" prop="user_Name">
              <el-input v-model="userForm.user_Name" @blur="checkName(userForm.user_Name)"></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-select v-model="userForm.user_Sex" placeholder="性别">
                <el-option label="男" value="man"></el-option>
                <el-option label="女" value="woman"></el-option>
                <el-option label="外星人" value="Alien"></el-option>
                <el-option label="沃尔玛" value="Wal"></el-option>
                <el-option label="不被定义的" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="年龄" prop="user_Age">
              <el-input v-model.number="userForm.user_Age" id="age"></el-input>
            </el-form-item>

          </el-form>
        </div>

        <div class="accountInfo_mod" v-show="active===1">
          <el-form :model="userForm"
                   label-width="100px"
                   class="demo-dynamic"
                   :rules="rules"
                   status-icon>
            <el-form-item label="邮箱" prop="user_Email">
              <el-input v-model="userForm.user_Email" @blur="verifyEmail"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="user_Password">
              <el-input type="password" v-model="userForm.user_Password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
              <el-input type="password" v-model="userForm.checkPass" autocomplete="off"></el-input>
            </el-form-item>

          </el-form>
        </div>
        <div class="codeInfo_mod" v-show="active===2">
          <span>请输入验证码</span>
          <div class="code-box" v-show="active===2">
            <div class="code-item"></div>
            <div class="code-item"></div>
            <div class="code-item"></div>
            <div class="code-item"></div>
            <!-- 该输入框需要隐藏 -->
            <input type="text" class="code-input" maxlength="4" v-model="userForm.code" @change="submitCode">
          </div>
        </div>
      </div>

      <div class="returnButton_mod">
        <el-button @click="returnStep" v-show="active>=1">上一步</el-button>
      </div>
      <div class="nextButton_mod">
        <el-button type="primary" @click="nextStep" v-show="active<2" :disabled="buttonSwitch">下一步</el-button>
      </div>
      <div class="submitButton_mod">
        <el-button type="primary" @click="submitUser" v-show="active===2">完成</el-button>
      </div>
    </div>
  </div>
</template>
<style src="../css/LRF/signUp.css"></style>
<style scoped>
</style>