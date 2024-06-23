<script setup>
import {markRaw, onMounted, ref, watch} from "vue";
import {ElMessageBox, ElNotification} from "element-plus";
import {
  aFollowUser, aGetSumFollowAndFan,
  aIfFollowUser,
  aSelectUserInfoByID,
  aUserUnfollowFan
} from "@/api/api.js";
import {useRoute} from "vue-router";
import {ChatLineRound, CloseBold, WarnTriangleFilled} from "@element-plus/icons-vue";
import followForm from "@/components/SecondPage/userDetail/otherForm/followForm.vue";
import fansForm from "@/components/SecondPage/userDetail/otherForm/fansForm.vue";
import useFlagStore from "@/store/flagStore.js";

const route = useRoute()
const flagStore = useFlagStore();
const user_ID = route.query.user_ID
let sex_logo = ref("")
let ifFollow = ref(false)
let user = ref({
  user_ID: '',
  user_Name: '',
  user_Sex: '',
  user_Age: '',
  user_Birthday: '',
  user_Avatar: '/src/photos/logo/avatarWhite.png',
  user_Introduction: '',
})

let messageForm = ref({
  message_content: ''
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

//监听关注与粉丝的变化
watch(() => flagStore.flag, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    getSumFollowAndFan(user_ID)
  }
},)

onMounted(() => {
  selectUserDetail(user_ID)
  ifFollowUser(user_ID)
  getSumFollowAndFan(user_ID)
})


/* 用户详情查询*/
function selectUserDetail(user_ID) {
  aSelectUserInfoByID(user_ID).then(resp => {
    if (resp.data.code === 200) {
      user.value = resp.data.data;
      changeSexLogo()
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

function ifFollowUser(ID) {
  aIfFollowUser(ID).then(resp => {
    ifFollow.value = resp.data.data;
  })
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

function followDetail() {
  flagStore.flag = true
  selComponent.value = detailForm.value[0].component;

}

function fansDetail() {
  flagStore.flag = true
  selComponent.value = detailForm.value[1].component;
}

function otherAccount() {
  console.log("aaa")
}

function followUser(ID) {
  aFollowUser(ID).then(resp => {
    if (resp.data.code === 200) {
      ElNotification({
        title: "关注成功！",
        type: 'success',
        duration: 2000,
      })
      ifFollowUser(ID)
      getSumFollowAndFan(user_ID)
    }
  })
}

function unFollowUser(ID) {
  ElMessageBox.confirm('确认取消关注该好友吗？', {
    confirmButtonText: '仍然取消',
    cancelButtonText: '继续关注',
    type: 'warning',
  }).then(_ => {
    aUserUnfollowFan(ID).then(resp => {
      if (resp.data.code === 200) {
        ElNotification({
          title: "已取关！",
          type: 'success',
          duration: 2000,
        })
        ifFollowUser(ID)
        getSumFollowAndFan(user_ID)
      } else {
        console.log(resp.data.msg)
      }
    })
  }).catch(_ => {
  });
}

//todo 打开发送消息
function openMess() {

}

//todo 发送消息
function postMess(user_ID) {

}


</script>

<template>
  <div class="INFO_mode">
    <!--用户资料-->
    <div class="userInfo_mod">
      <div class="userAvatar_mod">
        <img :src="user.user_Avatar">
      </div>
      <div class="nameAndOther_mod">
        <label class="username_mod">{{ user.user_Name }}</label>
        <!--修改性别时切换性别logo-->
        <div class="InfoLogo">
          <img id="sexLogo" :src=sex_logo alt="">
        </div>
        <!--todo 关注与粉丝模块（暂无bug）-->
        <div class="followAndFans_mod">
          <span @click="followDetail()">{{ sumFollowAndFan.followSum }} 关注</span>
          <span @click="fansDetail()">{{ sumFollowAndFan.fanSum }} 粉丝</span>
        </div>
        <div class="userIntroduction_mod" v-if="![null,''].includes(user.user_Introduction)">
          <el-tooltip
              class="box-item"
              :content="user.user_Introduction"
              placement="right"
              effect="light"
          >
            <span>简介：{{ user.user_Introduction }}</span>
          </el-tooltip>
        </div>
        <div class="dOption_mod">
          <el-button type="danger" round v-if="!ifFollow" @click="followUser(user.user_ID)"> + 关注</el-button>
          <el-button type="danger" round v-if="ifFollow" @click="unFollowUser(user.user_ID)">
            <el-icon>
              <Switch/>
            </el-icon>
            已关注
          </el-button>
          <el-button type="info">
            <el-icon>
              <ChatLineRound @click="postMess()"/>
            </el-icon>
          </el-button>
          <el-dropdown trigger="click">
            <el-button type="info">+</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :icon="CloseBold">加入黑名单</el-dropdown-item>
                <el-dropdown-item :icon="WarnTriangleFilled">举报</el-dropdown-item>
                <!--                <el-dropdown trigger="click">
                                  <el-dropdown-item :icon="WarnTriangleFilled">举报</el-dropdown-item>
                                  <template #dropdown>
                                    <el-dropdown-menu>
                                      <el-dropdown-item >低俗</el-dropdown-item>
                                      <el-dropdown-item >恶意</el-dropdown-item>
                                      <el-dropdown-item >敏感</el-dropdown-item>
                                      <el-dropdown-item >色情</el-dropdown-item>
                                      <el-dropdown-item >其他原因</el-dropdown-item>
                                    </el-dropdown-menu>
                                  </template>
                                </el-dropdown>-->
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
  <div v-if="flagStore.flag">
    <KeepAlive>
      <component :is="selComponent" :user_ID=user_ID></component>
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
  background-image: linear-gradient(#333333, #ffffff);
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

.nameAndOther_mod {
  position: relative;
  top: -101px;
  left: 298px;
  width: 50%;
  height: 75%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.nameAndOther_mod span {
  font-family: STXihei, serif;
  color: white;
  font-size: small;
}

/*用户信息展示模块*/
.usernameLogo_mod {
  width: 125px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.username_mod {
  font-family: STXihei, serif;
  font-size: 30px;
  font-weight: 900;
  color: white;
}


.InfoLogo {
  width: 125px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: left;
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

/*性别logo动画旋转*/
@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/*关注与粉丝模块*/
.followAndFans_mod {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100px;
}

.followAndFans_mod span {
  font-family: STXihei, serif;
  font-weight: 800;
  font-size: 14px;
}

.userIntroduction_mod {

}

.locationAndOther {
  cursor: default;
  user-select: none;
  display: flex;
  width: 50%;
  align-items: center;
}

.moreThan {
  margin-left: 20px;
  display: flex;
  align-items: center
}

.dOption_mod {
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dOption_mod .el-button + .el-button {
  margin-left: 0px;
}

</style>