<script setup>
import {markRaw, onMounted, reactive, ref, watch} from "vue";
import {ElMessage} from "element-plus";
import bus from "@/eventbus.js";
import useUserStore from '@/store/userStore.js'
import useFlagStore from '@/store/flagStore.js'
import {
  aChangeUserInfo,
  aCheckName,
  aGetSumFollowAndFan,
  aUploadUserAvatar,
  aUserDetail
} from "@/api/api.js";
import followForm from "@/components/myInfo/otherForm/followForm.vue";
import fansForm from "@/components/myInfo/otherForm/fansForm.vue";


const userStore = useUserStore()
const flagStore = useFlagStore();

let dialogVisible = ref(false)
let fileList = ref([])
let fileType = ref(["png", "jpg", "jpeg"])
let fileSize = ref(50)
let fileName = ref('')
let new_user_avatar = ref('')
let sex_logo = ref("")
const userID = ""
let user = ref({
  user_Name: '',
  user_Sex: '',
  user_Age: '',
  user_Birthday: '',
  user_Avatar: '/src/photos/logo/avatarWhite.png',
  user_Introduction: '',
})

let form = reactive({
  user_Name: '',
  user_Sex: '',
  user_Age: '',
  user_Birthday: '',
  user_Avatar: '/src/photos/logo/avatarWhite.png',
  user_Introduction: '',
})

let sumFollowAndFan = ref({
  followSum: 0,
  fanSum: 0
})

const detailForm = ref([
  {id: 1, name: '关注', component: markRaw(followForm)},
  {id: 2, name: '粉丝', component: markRaw(fansForm)}])

// 默认显示的组件页面
const selComponent = ref();

bus.on('userInfo', (data) => {
  user.value = data
  form = user.value
  new_user_avatar.value = data.user_Avatar;
  changeSexLogo()
})

//监听关注与粉丝的变化
watch(() => flagStore.flag, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    getSumFollowAndFan(userID)
  }
},)

onMounted(() => {
  getSumFollowAndFan(userID)
})

/* 用户详情查询*/
function selectUserDetail() {
  aUserDetail().then(resp => {
    if (resp.data.code === 200) {
      user.value = resp.data.data;
      new_user_avatar.value = resp.data.data.user_Avatar
      form = user.value
      changeSexLogo()
      bus.emit('user', user.value)
    } else if (resp.data.code === 500) {
      console.error(resp.data.msg)
    }
  })
}

function getSumFollowAndFan(userID) {
  aGetSumFollowAndFan(userID).then(resp => {
    if (resp.data.code === 200) {
      sumFollowAndFan.value = resp.data.data
    }
  })
}

//编辑用户
function beChangeInfo() {
  dialogVisible.value = true;
}

/*检查用户名是否存在*/
function checkName(row) {
  if (row == null) {
    ElMessage.error('名称不能为空！')
  }
  aCheckName(row).then(resp => {
    if (resp.data.code === 302) {
      ElMessage.error(resp.data.msg)
      form.user_Name = ''
    } else if (resp.data.code === 200) {
    }
  })
}

/*修改个人资料*/
function onSubmit() {
  if (form.user_Name == null) {
    ElMessage({
      message: "重申一遍！名称不能为空！",
      type: 'error',
    })
    return;
  }
  aChangeUserInfo(form).then(resp => {
    if (resp.data.code === 200) {
      dialogVisible.value = false
      ElMessage.success(resp.data.msg)
      selectUserDetail()
    } else if (resp.data.code === 500) {
      dialogVisible.value = false
      ElMessage({
        message: resp.data.msg,
        type: 'error',
      })
    }
    changeSexLogo()
  })
}

/*取消修改*/
function catchSubmit() {
  dialogVisible.value = false
  new_user_avatar.value = user.value.user_Avatar
}

/*上传头像前的验证*/
function beforeUpload(file) {
  if (file.type !== "" || file.type != null || file.type !== undefined) {
    //截取文件的后缀，判断文件类型
    const FileExt = file.name.replace(/.+\./, "").toLowerCase();
    //计算文件的大小
    const isLt5M = file.size / 1024 / 1024 < 20; //这里做文件大小限制
    //如果大于50M
    if (!isLt5M) {
      ElMessage({
        message: "上传文件大小不能超过 20MB!",
        type: 'error',
      })
      return false;
    }
    //如果文件类型不在允许上传的范围内
    if (fileType.value.indexOf(FileExt) !== -1) {
      new_user_avatar.value = URL.createObjectURL(new Blob([file]));//赋值图片的url，用于图片回显功能
      return true;
    } else {
      ElMessage({
        message: "上传文件格式不正确!",
        type: 'error',
      })
      return false;
    }
  }
}

/*上传头像*/
function uploadAvatar(item) {
  ElMessage({
    message: "头像正在上传！",
    type: 'success',
  })
  let FormDatas = new FormData()
  FormDatas.append('file', item.file);
  aUploadUserAvatar(FormDatas).then(resp => {
    if (resp.data.code === 200) {
      form.user_Avatar = resp.data.data
      ElMessage({
        message: "头像上传成功！",
        type: 'success',
      })
    } else {
      ElMessage({
        message: "上传失败！",
        type: 'error',
        duration: 1000
      })
    }
  })
}

function followDetail() {
  flagStore.flag = true
  selComponent.value = detailForm.value[0].component;

}

function fansDetail() {
  flagStore.flag = true
  selComponent.value = detailForm.value[1].component;
}

/*不同的性别对应不同的logo*/
function changeSexLogo() {
  switch (user.value.user_Sex) {
    case '男':
      sex_logo.value = "src/photos/logo/boy.png"
      break
    case '女':
      sex_logo.value = "src/photos/logo/girl.png"
      break
    case '外星人':
      sex_logo.value = "src/photos/logo/alien.png"
      break
    case '沃尔玛':
      sex_logo.value = "src/photos/logo/wal.png"
      break
    case '不被定义的':
      sex_logo.value = "src/photos/logo/alien.png"
      break
  }
}
</script>

<template>
  <div class="INFO_mode">
    <!--用户资料-->
    <div class="userInfo_mod">
      <div class="userAvatar_mod">
        <img :src="user.user_Avatar">
      </div>
      <div class="userIN_mod">
        <div class="usernameLogo_mod">
          <span class="username_mod">{{ user.user_Name }}</span>
          <img src="/src/photos/logo/editGray.png" class="changeINFOButton_mod" @click=beChangeInfo() alt="">
        </div>
        <!--修改性别时切换性别logo-->
        <div class="InfoLogo">
          <img id="sexLogo" :src=sex_logo alt="">
        </div>
        <div class="followAndFans">
          <span @click="followDetail()">{{ sumFollowAndFan.followSum }} 关注</span>
          <span @click="fansDetail()">{{ sumFollowAndFan.fanSum }} 粉丝</span>
        </div>
        <div class="userIntroduction_mod" v-if="![null,''].includes(user.user_Introduction)">
          <el-tooltip
              class="box-item"
              :content="user.user_Introduction"
              placement="bottom"
              effect="light"
          >
            <span>{{ user.user_Introduction }}</span>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>

  <!--编辑资料模块-->
  <div class="editUserInfo" id="edituserinfo">
    <el-dialog
        title="编辑个人信息"
        v-model="dialogVisible"
        width="50%"
    >
      <div class="editForm" id="editform">
        <el-form :model="form" label-width="80px">
          <el-form-item label="昵称：" id="username">
            <el-input size="large" v-model="form.user_Name" @blur="checkName(form.user_Name)"></el-input>
          </el-form-item>
          <el-form-item label="生日：" id="user_Birthday">
            <el-col :span="11">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.user_Birthday"
                              value-format="YYYY-MM-DD"
                              size="large"></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="性别：" id="user_Sex">
            <el-radio-group v-model="form.user_Sex">
              <el-radio label="男" value="男"></el-radio>
              <el-radio label="女" value="女"></el-radio>
              <el-radio label="外星人" value="外星人"></el-radio>
              <el-radio label="沃尔玛" value="沃尔玛"></el-radio>
              <el-radio label="不被定义的" value="不被定义的"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item size="large" label="简介：" id="eidtuserIntroduction">
            <el-input type="textarea"
                      v-model="form.user_Introduction"
                      placeholder="200"
                      maxlength="200"
                      show-word-limit></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="large" @click="catchSubmit()">取消</el-button>
            <el-button size="large" type="primary" @click="onSubmit()">保存</el-button>
          </el-form-item>
        </el-form>
        <!--更换头像-->
        <div class="editAvatar">
          <label class="changeAvatar"><i class="el-icon-picture-outline-round"></i>切换头像</label>
          <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :http-request="uploadAvatar"
          >
            <img :src="new_user_avatar" class="avatar" alt="">
          </el-upload>
        </div>
      </div>
    </el-dialog>
  </div>
  <div v-if="flagStore.flag">
    <KeepAlive>
      <component :is="selComponent"></component>
    </KeepAlive>
  </div>
</template>

<style scoped>
/**
个人资料模块
 */
.INFO_mode {
  width: 100%;
}

/*用户资料*/
.userInfo_mod {
  width: 100%;
  height: 240px;
  background-image: linear-gradient(#414141, #ababab, #ffffff);
}

/*用户头像模块*/
.userAvatar_mod {
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: 50%;
  position: relative;
  top: 50%;
  left: 10%;
  transform: translate(-50%, -50%);
}

.userAvatar_mod img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  transition: 5s all ease-in-out;
}

.userAvatar_mod img:hover {
  transition: 0.5s all ease-in-out;
  transform: scale(1.2, 1.2);
}

.userIN_mod {
  /*选项模块*/
  min-width: 300px;
  height: 224px;
  /* padding-top: 23px; */
  position: relative;
  top: -104px;
  left: 298px;
  display: flex;
  flex-direction: column;
  justify-content: start;
}


/*用户信息展示模块*/
.usernameLogo_mod {
  width: 125px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.username_mod {
  font-family: STXihei, serif;
  font-size: 30px;
  font-weight: 900;
  color: white;
}

/*编辑按钮*/
.changeINFOButton_mod {
  width: 25px;
  height: 25px;
  cursor: pointer;
}

.InfoLogo {
  width: 125px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: left;
  margin-bottom: 15px;
}

.InfoLogo img {
  width: 22px;
  height: 22px;
  margin-left: 10px;
  border-radius: 50%;
  transition: 0.5s all ease-in-out;
  animation-play-state: paused;
}

.InfoLogo img:hover {
  animation: rotation 0.5s linear infinite;
  transition: 0.5s all ease-in-out;
}

.followAndFans {
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.followAndFans span {
  font-family: STXihei, serif;
  color: rgb(114, 69, 35);
  cursor: pointer;
}

/*简介*/
.userIntroduction_mod {
  font-family: STXihei, serif;
  color: #ffffff;
  font-size: 15px;
  white-space: nowrap; /*强制单行显示*/
  text-overflow: ellipsis; /*超出部分省略号表示*/
  overflow: hidden; /*超出部分隐藏*/
  width: 1000px; /*设置显示的最大宽度*/
  display: inline-block;
  margin-bottom: 15px;
}


/*性别logo动画旋转*/
@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

</style>
<style src="../../components/css/myInfo/userInfoEditForm.css"></style>