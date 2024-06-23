<script setup>
import {onMounted, reactive, ref, watch} from 'vue';
import bus from "@/eventbus.js";
import axios from "axios";
import {useRoute} from "vue-router";
import useUserStore from '@/store/userStore.js'
import useMusicPlayStore from "@/store/musicPlayStore.js";

import {
  aDelMess,
  aGetSingerByUser,
  aGetUserMessages,
  aIfMy,
  aLogOff, aSinLogOff,
  aUserDetail
} from "@/api/api.js";
import {ElMessageBox, ElNotification} from "element-plus";
import router from "@/router/index.js";
import {store} from "xijs";
import {Message} from "@element-plus/icons-vue";

//使用pinia获得用户数据
const userStore = useUserStore()
const musicPlayStore = useMusicPlayStore();
const route = useRoute()
const isDot = ref(true)
const drawer = ref(false)
let messExist = ref(true)
let user = ref(
    {user_Name: '', user_ID: '', user_Avatar: 'src/photos/logo/avatarWhite.png', user_Sex: ''}
)
let messageList = ref([{
  message_id: '',
  poster_id: '',
  poster_name: '',
  poster_avatar: '',
  message_content: '',
  post_time: ''
}])


onMounted(() => {
  //store:js工具库所封装的localStorage（可实现过期时间）
  let token = store.get('access_token').value
  let stoken = store.get('access_singer_token').value

  selectUserDetail()
  getUserMessage()
})

const toUserInfo = (user_ID) => {
  aIfMy(user_ID).then(resp => {
    if (resp.data.data) {
      router.push({
        path: '/myInfo',
      })
    } else {
      router.push({
        path: '/userDetail',
        query: {user_ID}
      })
    }
  })
}

function toArtists() {
  musicPlayStore.play = false
  let singerToken = store.get('access_singer_token').value
  if (singerToken === null) {
    aGetSingerByUser().then(resp => {
      if (resp.data.code === 200) {
        store.set("access_singer_token", resp.data.data, Date.now() + 1000 * 60 * 60 * 24 * 7)
        //todo 无法成功跳转
        router.go({
          path: '/artHome',
        })
      } else {
        router.push({
          path: '/artists',
        })
      }
    }).catch(resp => {
      router.push({
        path: '/artists',
      })
    })
  } else {
    router.push({
      path: '/artHome',
    })
  }
}

function checkMessage(param) {
  if (isDot.value) {
    isDot.value = false;
  }
  drawer.value = !drawer.value;
}

const handleClose = () => {
  drawer.value = !drawer.value;
}

function selectUserDetail() {
  aUserDetail().then(resp => {
    if (resp.data.code === 200) {
      user.value = resp.data.data
      bus.emit('userInfo', user.value)
      userStore.$state = resp.data.data
    } else if (resp.data.code === 401) {
      console.error(resp.data.msg)
    }
  }).catch(resp => {
    console.error(resp)
  })
}

function getUserMessage() {
  aGetUserMessages().then(resp => {
    if (resp.data.code === 200) {
      messageList.value = resp.data.data
    } else {
      messExist.value = false
    }
  }).catch(resp => {
    console.error(resp)
    messExist.value = false
  })
}


function logOff() {
  let token = store.get('access_token').value
  let singerToken = store.get('access_singer_token').value
  if (singerToken != null) {
    aSinLogOff(singerToken).then(resp => {
      if (resp.data.code === 200) {
        store.remove("access_singer_token")
      }
    })
  }
  if (token != null) {
    aLogOff(token).then(resp => {
      if (resp.data.code === 200) {
        store.remove("access_token")
        userStore.$reset()
        router.push({
          path: '/signIn',
        })
      }
    }).catch(resp => {
      ElNotification({
        title: '登录信息过期!',
        type: 'error'
      })
      store.remove("access_token")
      userStore.$reset()
      setTimeout(() => {
        router.push({
          path: '/signIn',
        })
      }, 1000)
    })
  } else {
    ElNotification({
      title: '请先登录!',
      type: 'error',
      position: 'top-left',
      duration: 2000
    })
  }
}


//登录
function toSignIn() {
  let token = store.get('access_token').value
  if (token != null) {
    ElNotification({
      title: '您已登录!',
      type: 'success',
      position: 'top-left',
      duration: 2000
    })
  } else {
    router.push({
      path: '/signIn',
    })
  }
}


function delMess(mess_id) {
  ElMessageBox.confirm('确认删除吗？', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(_ => {
    aDelMess(mess_id).then(resp => {
      if (resp.status === 401) {
        ElNotification({
          title: '请先登录!',
          type: 'error'
        })
      } else if (resp.data.code === 200) {
        ElNotification({
          title: '删除成功!',
          type: 'success',
          position: 'top-left',
          duration: 1000
        })
        getUserMessage()
      }
    })
  }).catch(_ => {
  });
}
</script>

<template>
  <div class="navbar navbar-expand-lg bg-primary navbar-dark">
    <nav class="container">
      <router-link to="/" href="#" class="navbar-brand">
        <img src="../icons/AUT.png">
      </router-link>
      <button class="navbar-toggler border-2" data-bs-target="#aa" data-bs-toggler="collapse">
        <i class="navbar-toggler-icon"></i>
      </button>
      <div class="navbar-collapse collapse " id="navbar_collapse">
        <form id="searchBox" class="d-flex me-auto " role="search">
          <input class="form-control me-2" type="search" placeholder="搜索你想听的音乐" aria-label="Search">
        </form>
        <div class="navbar-nav me-auto">
          <a href="#" class="nav-link" @click="toArtists">
            我是歌手
          </a>
        </div>
        <div id="split" class="navbar-nav">
        </div>
        <ul class="navbar-nav align-items-center">
          <li class="nav-item me-5">
            <el-dropdown trigger="contextmenu">
              <div title="点击右键设置">
                <router-link to="/myInfo">
                  <img style="margin-right: 15px" class="nav_avatar" :src=user.user_Avatar alt="avatar">
                </router-link>
                <router-link to="/myInfo">
                  <span style="color: black;font-family: SimHei, serif;cursor: pointer">{{ user.user_Name }}</span>
                </router-link>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="toSignIn()">登录</el-dropdown-item>
                  <el-dropdown-item divided @click="logOff()">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </li>
          <li class="nav-item  me-2">
            <div class="message_mod">
              <!--todo 消息模块待完善-->
              <el-badge :is-dot="isDot" class="item" style="width: 1.4em;">
                <Message style="width: 1.3em; height: 1.3em; margin-right: 8px;" @click="checkMessage"/>
              </el-badge>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  </div>
  <div id="mess">
    <el-drawer
        v-model="drawer"
        title="消息通知"
        :before-close="handleClose"
    >
      <!--todo 信息详情页面(没有解决方案)-->
      <template #header="{ close, titleId, titleClass }">
        <span :id="titleId" :class="titleClass"
              style="font-weight: 900;font-size: large;color: #e58c43">消息通知!</span>
      </template>
      <div class="fMessage_mod">
        <div class="messageList" v-if="messExist" v-for="item in messageList">
          <img :src="item.poster_avatar" @click="toUserInfo(item.poster_id)">
          <div class="messInfo">
            <div class="nameAndTime">
              <span style="color: #546a9b;font-size: larger">{{ item.poster_name }}</span>
              <span style="font-size: small;color: #595959">{{ item.post_time }}</span>
            </div>
            <el-tooltip
                class="box-item"
                :content="item.message_content"
                placement="bottom"
                effect="light"
            >
              <span class="messText">{{ item.message_content }}</span>
            </el-tooltip>
          </div>
          <div class="delMess" @click="delMess(item.message_id)">
            <svg t="1716647697469" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                 p-id="3742" width="200" height="200">
              <path d="M262.2 304.9h-4.8c0.8-0.1 1.6-0.1 2.4-0.1 0.8 0 1.6 0 2.4 0.1z" fill="#515151"
                    p-id="3743"></path>
              <path
                  d="M589.4 358.4c0 15.2 12.3 27.5 27.4 27.5h25.8c15.2 0 27.5-12.3 27.5-27.4 0-15.2-12.3-27.4-27.5-27.4h-25.8c-15.1-0.1-27.4 12.2-27.4 27.3zM616.3 850.4c15.2 0.6 27.9-11.3 28.4-26.4l0.9-351c0.6-15.2-11.3-27.9-26.4-28.4-15.2-0.6-27.9 11.3-28.4 26.4l-0.9 351c-0.6 15.1 11.3 27.9 26.4 28.4zM457.1 822l-0.9-351c-0.6-15.2-13.3-27-28.4-26.4-15.1 0.6-27 13.3-26.4 28.4l0.9 351c0.6 15.1 13.3 27 28.4 26.4 15.1-0.5 27-13.3 26.4-28.4z"
                  fill="#515151" p-id="3744"></path>
              <path
                  d="M826.5 358.3l-1.7 27.6-27.9 502.4-0.4 6.9c0 24.5-19.6 44.4-43.9 45H272.1c-24.3-0.6-43.9-20.6-43.9-45l-0.4-6.8L200 385.9l-1.7-27.6v-0.3c0.2-14.2 11.1-25.8 25.1-27H518c15.2 0 27.5 12.3 27.5 27.4 0 15.2-12.3 27.4-27.5 27.4H255l22.5 405.8 4.9 79.3 0.5 7.9 0.4 6.7h458.4l0.4-6.7 0.5-7.9 4.9-79.3L770 385.8h-28.3c-15.2 0-27.4-12.3-27.4-27.4 0-15.2 12.3-27.4 27.4-27.4h59.8c14 1.2 25 12.9 25.1 27.1-0.1 0.1-0.1 0.1-0.1 0.2zM475.2 143.2l-4.6-27c-2.5-14.9 7.5-29.1 22.5-31.7C508 82 522.2 92 524.8 107l4.6 27c2.5 14.9-7.5 29.1-22.5 31.7-15 2.5-29.2-7.5-31.7-22.5z"
                  fill="#515151" p-id="3745"></path>
              <path
                  d="M792.6 150.4l-560.5 95.4c-14.9 2.5-29.1-7.5-31.7-22.5-2.5-14.9 7.5-29.1 22.5-31.7l560.5-95.4c14.9-2.5 29.1 7.5 31.7 22.5 2.5 14.9-7.5 29.1-22.5 31.7z"
                  fill="#515151" p-id="3746"></path>
            </svg>
          </div>
        </div>
        <div class="noMess" v-if="!messExist">
          <svg t="1716995099787" class="icon" viewBox="0 0 1194 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
               p-id="12094" width="200" height="200">
            <path
                d="M457.386667 416.426667H375.466667l-34.816 40.96-33.450667-40.96H225.28c-30.037333 0-54.613333-24.576-54.613333-54.613334V245.76c0-30.037333 24.576-54.613333 54.613333-54.613333h232.106667c30.037333 0 54.613333 24.576 54.613333 54.613333v116.053333c0 30.037333-24.576 54.613333-54.613333 54.613334z"
                fill="#FFFFFF" p-id="12095"></path>
            <path
                d="M720.213333 890.88h-341.333333c-1.365333 0-2.730667-1.365333-2.048-3.413333l46.421333-124.928c0.682667-0.682667 1.365333-1.365333 2.048-1.365334h247.808c0.682667 0 2.048 0.682667 2.048 1.365334l46.421334 124.928c1.365333 2.048 0 3.413333-1.365334 3.413333z"
                fill="#DAE5EF" p-id="12096"></path>
            <path
                d="M1126.4 471.04h-218.453333c26.624 0 47.786667-21.162667 47.786666-47.786667s-21.162667-47.786667-47.786666-47.786666h157.013333c26.624 0 47.786667-21.162667 47.786667-47.786667s-21.162667-47.786667-47.786667-47.786667h-300.373333c2.048 0 4.778667 0 6.826666-0.682666-23.210667-3.413333-40.96-23.210667-40.96-47.104 0-23.893333 17.749333-43.690667 40.96-47.104-2.048 0-4.778667-0.682667-6.826666-0.682667h75.093333c26.624 0 47.786667-21.162667 47.786667-47.786667s-21.162667-47.786667-47.786667-47.786666H184.32c-26.624 0-47.786667 21.162667-47.786667 47.786666s21.162667 47.786667 47.786667 47.786667h232.106667c26.624 0 47.786667 21.162667 47.786666 47.786667s-21.162667 47.786667-47.786666 47.786666H109.226667c-26.624 0-47.786667 21.162667-47.786667 47.786667s21.162667 47.786667 47.786667 47.786667h375.466666c-26.624 0-47.786667 21.162667-47.786666 47.786666s21.162667 47.786667 47.786666 47.786667H348.16c-26.624 0-47.786667 21.162667-47.786667 47.786667s21.162667 47.786667 47.786667 47.786666h307.2c-22.528 0-40.96 18.432-40.96 40.96s18.432 40.96 40.96 40.96H197.973333c-26.624 0-47.786667 21.162667-47.786666 47.786667s21.162667 47.786667 47.786666 47.786667h204.8-3.413333c24.576 2.048 44.373333 22.528 44.373333 47.786666s-19.797333 45.738667-44.373333 47.786667h3.413333-88.746666c-26.624 0-47.786667 21.162667-47.786667 47.786667s21.162667 47.786667 47.786667 47.786666h716.8c26.624 0 47.786667-21.162667 47.786666-47.786666s-21.162667-47.786667-47.786666-47.786667H648.533333c-0.682667 0-3.413333-0.682667-6.144-2.048-19.797333-6.144-34.133333-23.893333-34.133333-45.738667s14.336-39.594667 34.133333-45.738666c2.048-0.682667 4.778667-2.048 6.144-2.048h266.24c26.624 0 47.786667-21.162667 47.786667-47.786667s-21.162667-47.786667-47.786667-47.786667c22.528 0 40.96-18.432 40.96-40.96s-18.432-40.96-40.96-40.96h211.626667c26.624 0 47.786667-21.162667 47.786667-47.786666s-21.162667-47.786667-47.786667-47.786667z"
                fill="#F0F2F9" p-id="12097"></path>
            <path
                d="M964.608 916.821333l-346.112 2.048c-2.048 0-3.413333-2.048-3.413333-3.413333l12.970666-131.754667c0-1.365333 1.365333-2.730667 3.413334-2.730666l251.221333-0.682667c1.365333 0 2.048 0.682667 2.730667 1.365333l81.92 131.072c0.682667 0.682667-0.682667 4.096-2.730667 4.096z"
                fill="#DAE5EF" p-id="12098"></path>
            <path d="M946.176 899.754667H615.082667l19.114666-119.466667h234.154667z" fill="#FFFFFF"
                  p-id="12099"></path>
            <path
                d="M962.56 903.168H614.4c-0.682667 0-2.048-0.682667-2.730667-1.365333-0.682667-0.682667-0.682667-2.048-0.682666-2.730667l19.114666-119.466667c0-1.365333 1.365333-2.730667 3.413334-2.730666h251.221333c1.365333 0 2.048 0.682667 2.730667 1.365333l77.824 119.466667c0.682667 1.365333 0.682667 2.048 0 3.413333 0 0.682667-1.365333 2.048-2.730667 2.048z m-344.064-6.826667h337.92l-73.728-112.64H636.245333l-17.749333 112.64z"
                fill="#B1C4DE" p-id="12100"></path>
            <path d="M723.626667 873.813333H375.466667l48.469333-112.64h251.221333z" fill="#FFFFFF" p-id="12101"></path>
            <path d="M722.944 873.813333H481.28l48.469333-112.64h144.725334z" fill="#DAE5EF" p-id="12102"></path>
            <path d="M708.608 873.813333H391.850667l49.152-112.64h218.453333z" fill="#F1F5F8" p-id="12103"></path>
            <path
                d="M723.626667 877.226667H375.466667c-1.365333 0-2.048-0.682667-2.730667-1.365334-0.682667-0.682667-0.682667-2.048 0-3.413333l48.469333-112.64c0.682667-1.365333 2.048-2.048 3.413334-2.048H675.84c1.365333 0 2.730667 0.682667 3.413333 2.048l48.469334 112.64c0.682667 1.365333 0.682667 2.048 0 3.413333-2.048 0.682667-2.730667 1.365333-4.096 1.365334z m-342.698667-6.826667h337.92L673.109333 764.586667H425.984l-45.056 105.813333zM491.52 143.36c-11.605333 0-20.48-8.874667-20.48-20.48s8.874667-20.48 20.48-20.48 20.48 8.874667 20.48 20.48-8.874667 20.48-20.48 20.48z m0-34.133333c-7.509333 0-13.653333 6.144-13.653333 13.653333s6.144 13.653333 13.653333 13.653333 13.653333-6.144 13.653333-13.653333-6.144-13.653333-13.653333-13.653333zM54.613333 443.733333c-11.605333 0-20.48-8.874667-20.48-20.48s8.874667-20.48 20.48-20.48 20.48 8.874667 20.48 20.48-8.874667 20.48-20.48 20.48z m0-34.133333c-7.509333 0-13.653333 6.144-13.653333 13.653333s6.144 13.653333 13.653333 13.653334 13.653333-6.144 13.653334-13.653334-6.144-13.653333-13.653334-13.653333zM1112.746667 662.186667c-11.605333 0-20.48-8.874667-20.48-20.48s8.874667-20.48 20.48-20.48 20.48 8.874667 20.48 20.48-8.874667 20.48-20.48 20.48z m0-34.133334c-7.509333 0-13.653333 6.144-13.653334 13.653334s6.144 13.653333 13.653334 13.653333 13.653333-6.144 13.653333-13.653333-6.144-13.653333-13.653333-13.653334z"
                fill="#B1C4DE" p-id="12104"></path>
            <path
                d="M948.906667 667.648H675.84l-64.853333 68.266667-67.584-68.266667H484.693333c-37.546667 0-68.266667-30.72-68.266666-68.266667V341.333333c0-37.546667 30.72-68.266667 68.266666-68.266666h464.213334c37.546667 0 68.266667 30.72 68.266666 68.266666v258.048c0 38.229333-30.72 68.266667-68.266666 68.266667z"
                fill="#666666" p-id="12105"></path>
            <path
                d="M912.725333 648.533333H641.706667l-40.96 47.786667-57.344-47.786667H484.693333c-37.546667 0-68.266667-30.72-68.266666-68.266666V341.333333c0-37.546667 30.72-68.266667 68.266666-68.266666h428.032c37.546667 0 68.266667 30.72 68.266667 68.266666v238.933334c0 37.546667-30.72 68.266667-68.266667 68.266666z"
                fill="#FFFFFF" p-id="12106"></path>
            <path d="M716.8 457.386667m-30.72 0a30.72 30.72 0 1 0 61.44 0 30.72 30.72 0 1 0-61.44 0Z" fill="#FFFFFF"
                  p-id="12107"></path>
            <path
                d="M716.8 430.08c15.018667 0 27.306667 12.288 27.306667 27.306667s-12.288 27.306667-27.306667 27.306666-27.306667-12.288-27.306667-27.306666 12.288-27.306667 27.306667-27.306667m0-6.826667c-19.114667 0-34.133333 15.018667-34.133333 34.133334s15.018667 34.133333 34.133333 34.133333 34.133333-15.018667 34.133333-34.133333-15.018667-34.133333-34.133333-34.133334z"
                fill="#B1C4DE" p-id="12108"></path>
            <path d="M573.44 457.386667m-30.72 0a30.72 30.72 0 1 0 61.44 0 30.72 30.72 0 1 0-61.44 0Z" fill="#FFFFFF"
                  p-id="12109"></path>
            <path
                d="M573.44 430.08c15.018667 0 27.306667 12.288 27.306667 27.306667s-12.288 27.306667-27.306667 27.306666-27.306667-12.288-27.306667-27.306666 12.288-27.306667 27.306667-27.306667m0-6.826667c-19.114667 0-34.133333 15.018667-34.133333 34.133334s15.018667 34.133333 34.133333 34.133333 34.133333-15.018667 34.133333-34.133333-15.018667-34.133333-34.133333-34.133334z"
                fill="#B1C4DE" p-id="12110"></path>
            <path d="M860.16 457.386667m-30.72 0a30.72 30.72 0 1 0 61.44 0 30.72 30.72 0 1 0-61.44 0Z" fill="#FFFFFF"
                  p-id="12111"></path>
            <path
                d="M860.16 430.08c15.018667 0 27.306667 12.288 27.306667 27.306667s-12.288 27.306667-27.306667 27.306666-27.306667-12.288-27.306667-27.306666 12.288-27.306667 27.306667-27.306667m0-6.826667c-19.114667 0-34.133333 15.018667-34.133333 34.133334s15.018667 34.133333 34.133333 34.133333 34.133333-15.018667 34.133333-34.133333-15.018667-34.133333-34.133333-34.133334zM860.16 276.48h-3.413333c-2.048 0-3.413333-1.365333-3.413334-3.413333s1.365333-3.413333 3.413334-3.413334h3.413333c2.048 0 3.413333 1.365333 3.413333 3.413334s-1.365333 3.413333-3.413333 3.413333z"
                fill="#B1C4DE" p-id="12112"></path>
            <path
                d="M610.986667 720.213333c-0.682667 0-2.048-0.682667-2.730667-0.682666l-66.901333-67.584H484.693333c-39.594667 0-71.68-32.085333-71.68-71.68V341.333333c0-39.594667 32.085333-71.68 71.68-71.68h336.554667c2.048 0 3.413333 1.365333 3.413333 3.413334s-1.365333 3.413333-3.413333 3.413333H484.693333c-35.498667 0-64.853333 29.354667-64.853333 64.853333v238.933334c0 35.498667 29.354667 64.853333 64.853333 64.853333h58.709334c0.682667 0 2.048 0.682667 2.730666 0.682667l65.536 65.536 62.122667-65.536c0.682667-0.682667 1.365333-1.365333 2.730667-1.365334h273.066666c35.498667 0 64.853333-29.354667 64.853334-64.853333V341.333333c0-35.498667-29.354667-64.853333-64.853334-64.853333H880.64c-2.048 0-3.413333-1.365333-3.413333-3.413333s1.365333-3.413333 3.413333-3.413334h68.266667c39.594667 0 71.68 32.085333 71.68 71.68v238.933334c0 39.594667-32.085333 71.68-71.68 71.68H677.205333l-64.170666 66.901333c0 0.682667-1.365333 1.365333-2.048 1.365333z"
                fill="#B1C4DE" p-id="12113"></path>
            <path
                d="M457.386667 416.426667H375.466667l-20.48 13.653333-20.48-13.653333H266.24c-30.037333 0-54.613333-24.576-54.613333-54.613334V245.76c0-30.037333 24.576-54.613333 54.613333-54.613333h191.146667c30.037333 0 54.613333 24.576 54.613333 54.613333v109.226667c0 30.037333-24.576 61.44-54.613333 61.44z"
                fill="#ff5d00" p-id="12114"></path>
            <path
                d="M245.76 232.106667h225.28v13.653333H245.76zM245.76 293.546667h225.28v13.653333H245.76zM245.76 354.986667h90.112v13.653333H245.76z"
                fill="#FFFFFF" p-id="12115"></path>
            <path
                d="M170.666667 309.248c-2.048 0-3.413333-1.365333-3.413334-3.413333v-2.048c0-2.048 1.365333-3.413333 3.413334-3.413334s3.413333 1.365333 3.413333 3.413334v2.048c0 2.048-1.365333 3.413333-3.413333 3.413333z"
                fill="#B1C4DE" p-id="12116"></path>
            <path
                d="M340.650667 460.8c-1.365333 0-2.048-0.682667-2.730667-1.365333l-32.768-39.594667H225.28c-32.085333 0-58.026667-25.941333-58.026667-58.026667v-27.989333c0-2.048 1.365333-3.413333 3.413334-3.413333s3.413333 1.365333 3.413333 3.413333V361.813333c0 27.989333 23.210667 51.2 51.2 51.2h81.92c0.682667 0 2.048 0.682667 2.730667 1.365334l30.72 37.546666 32.085333-37.546666c0.682667-0.682667 1.365333-1.365333 2.730667-1.365334h81.92c27.989333 0 51.2-23.210667 51.2-51.2V245.76c0-27.989333-23.210667-51.2-51.2-51.2H225.28c-27.989333 0-51.2 23.210667-51.2 51.2v41.642667c0 2.048-1.365333 3.413333-3.413333 3.413333s-3.413333-1.365333-3.413334-3.413333V245.76c0-32.085333 25.941333-58.026667 58.026667-58.026667h232.106667c32.085333 0 58.026667 25.941333 58.026666 58.026667v116.053333c0 32.085333-25.941333 58.026667-58.026666 58.026667H376.832l-33.450667 39.594667c-0.682667 0.682667-1.365333 1.365333-2.730666 1.365333z"
                fill="#B1C4DE" p-id="12117"></path>
          </svg>
          <span>暂无消息</span>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<style scoped src="../css/AUTnav.css"></style>
<style scoped>
</style>