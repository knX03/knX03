<script setup>
import {defineProps, onMounted, ref, watch} from "vue";
import useFlagStore from '@/store/flagStore.js'
import router from "@/router/index.js";
import {aGetUserFollow, aIfMy} from "@/api/api.js";

const flagStore = useFlagStore();
const {user_ID} = defineProps(['user_ID']);
const userID = user_ID;
let followExist = ref(true)
let followList = ref([{
  user_ID: '',
  user_Avatar: '',
  user_Name: '',
  user_Introduction: '',
}])
let ifMyFlag = ref(false)

onMounted(() => {
  getUserFollow(userID)
  ifMy(userID)
})

const toUserDetail = (user_ID) => {
  if (ifMyFlag) {
    router.push({
      path: '/myInfo',
    })
  } else {
    router.push({
      path: '/userDetail',
      query: {user_ID}
    })
  }
}

function ifMy(user_ID) {
  aIfMy(user_ID).then(resp => {
    ifMyFlag.value = resp.data.data
  })
}

function getUserFollow(userID) {
  aGetUserFollow(userID).then(resp => {
    if (resp.data.code === 200) {
      followList.value = resp.data.data
    } else {
      followExist.value = false
    }
  })
}

function messUser(user_ID) {
  console.log(user_ID)
}
</script>
<template>
  <div id="followFM">
    <el-dialog
        v-model="flagStore.flag"
        title="TA的关注"
        width="500"
        class="fansFMDia"
    >
      <el-scrollbar max-height="700px" noresize>
        <div class="followList" v-if="followExist" @click="toUserDetail(item.user_ID)" v-for="item in followList">
          <div class="fAvatar">
            <img :src="item.user_Avatar">
          </div>
          <div class="fNameAndfIntro">
            <span style="font-size: 18px">{{ item.user_Name }}</span>
            <span class="fIntro">{{ item.user_Introduction }}</span>
          </div>
          <div id="messBT" v-if="ifMyFlag">
            <el-button type="info" plain round @click.stop="messUser(item.follow_id)">
              <el-icon>
                <Message/>
              </el-icon>
              &nbsp;私信
            </el-button>
          </div>
          <div class="noMessBT" v-if="!ifMyFlag">
          </div>
        </div>
        <div class="noFollow" v-if="!followExist">
          <svg t="1717070992046" class="icon" viewBox="0 0 1359 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
               p-id="7748" width="200" height="200">
            <path
                d="M425.847 921.576c-63.072-0.004-126.141 0.023-189.211-0.046-6.548-0.008-13.207 0.023-19.618-1.095-7.073-1.236-12.13-5.493-11.345-13.568 0.726-7.494 5.089-11.951 12.744-12.576 4.575-0.373 9.185-0.47 13.777-0.473 129.426-0.023 258.852-0.02 388.276-0.015 3.284 0 6.57 0.023 9.853 0.115 9.232 0.266 17.791 2.3 18.019 13.588 0.23 11.392-8.23 13.843-17.52 13.927-20.363 0.19-40.732 0.14-61.098 0.147-47.957 0.015-95.917 0.004-143.877-0.004z m266.44 23.41H883.46c2.628 0 5.26-0.125 7.883-0.009 9.861 0.447 22.426-0.331 22.974 12.703 0.6 14.316-12.625 14.979-23.016 15.017-62.41 0.278-124.822 0.062-187.233 0.054-65.682-0.008-131.364 0.039-197.041 0.039-6.57 0-13.146 0.023-19.703-0.278-9.562-0.44-17.117-3.91-16.707-14.994 0.385-10.414 8.127-12.383 16.697-12.413 19.051-0.07 38.105-0.055 57.154-0.058 49.274-0.004 98.545 0 147.818 0v-0.062z"
                fill="#707070" p-id="7749"></path>
            <path
                d="M507.517 1008.53c-47.243-0.008-94.486 0.05-141.726-0.073-6.523-0.015-13.173-0.304-19.524-1.622-5.683-1.178-8.584-5.825-8.564-11.72 0.017-5.732 2.338-10.713 8.094-12.124 5.642-1.379 11.64-1.772 17.483-1.776 94.485-0.1 188.97-0.173 283.455 0.074 11.928 0.031 29.623-2.975 29.893 13.831 0.292 18.223-17.967 13.06-29.358 13.192-46.578 0.535-93.166 0.222-139.753 0.219z"
                fill="#707070" p-id="7750"></path>
            <path
                d="M853.17 996.256c42.06 0.019 84.124-0.062 126.185 0.08 9.755 0.031 22.178-1.202 22.517 12.66 0.36 14.706-12.37 14.921-22.99 14.936-83.467 0.127-166.932 0.055-250.398-0.053-4.565-0.004-9.242-0.409-13.671-1.46-7.845-1.861-13.214-6.658-12.12-15.322 1.01-7.987 7.335-10.41 14.442-10.537 15.11-0.266 30.226-0.293 45.34-0.313 30.23-0.04 60.462-0.01 90.696 0.009z"
                fill="#707070" p-id="7751"></path>
            <path
                d="M997.165 894.133c26.907 0 53.812-0.126 80.715 0.07 9.38 0.066 20.33 0.462 19.622 13.45-0.482 8.807-7.75 12.356-15.434 12.895-11.658 0.82-151.684 1.672-171.805 0.373-8.424-0.54-16.004-3.544-16.02-13.669-0.014-10.49 7.881-12.818 16.303-12.88 28.874-0.212 57.747-0.08 86.619-0.08v-0.159z"
                fill="#707070" p-id="7752"></path>
            <path
                d="M171.501 44.157c-2.425 7.752-9.706 9.553-15.732 8.71-16.246-2.277-21.053 4.665-20.078 19.718 0.48 7.397 1.701 18.207-9.085 18.737-11.191 0.549-10.394-10.284-10.143-17.732 0.583-17.271-6.282-24.297-23.833-20.971-7.12 1.346-16.42 0.688-16.979-8.644-0.599-10.044 9.183-10.177 16.047-9.674 16.898 1.243 26.708-3.728 24.957-22.765-0.483-5.255 1.26-10.94 8.116-11.493 6.547-0.527 10.377 4.069 10.105 9.609-0.905 18.408 7.037 26.427 25.51 25.175 5.287-0.359 10.15 2.689 11.115 9.33z m80.763 139.291c-17.568-4.879-15.323 7.602-15.8 18.171-0.273 6.084 2.684 14.977-6.632 16.062-10.23 1.192-11.215-7.854-10.872-14.99 0.848-17.586-9.471-20.887-23.788-20.493-6.29 0.173-14.887 1.878-15.361-7.527-0.513-10.208 8.46-10.765 15.596-10.235 16.244 1.206 25.059-3.899 23.53-21.948-0.627-7.37-1.619-18.418 9.138-18.572 11.25-0.16 8.832 10.762 9.087 18.258 0.406 11.948-1.106 24.55 17.841 22.401 7.266-0.826 18.263-1.085 16.786 10.599-1.339 10.58-11.744 7.825-19.525 8.274z"
                fill="#707070" p-id="7753"></path>
            <path
                d="M658.069 100.525c74.107 0.46 141.763 49.076 164.516 118.216 24.52 74.514 1.293 149.359-60.782 195.862-18.107 13.564-17.965 13.28 1.462 23.093 13.288 6.713 26.474 13.776 39.012 21.772 8.836 5.636 14.305 14.414 7.718 24.833-6.826 10.791-16.51 10.572-27.111 4.616-29.522-16.585-60.068-29.04-94.231-34.625-121.902-19.929-253.73 77.801-256.804 212.526-0.13 5.695-1.484 11.62-3.536 16.948-2.72 7.065-8.123 11.923-16.294 11.612-8.196-0.312-12.62-5.918-15.597-12.802-2.915-6.743-3.094-13.912-2.282-21.056 11.305-99.489 59.383-173.923 149.769-219.434 26.539-13.364 26.573-13.296 2.797-31.724-92.303-71.537-79.918-228.365 22.498-284.882 30.322-16.734 60.23-25.132 88.865-24.955z m-3.147 311.83c78.507 0.535 139.196-57.536 139.753-133.727 0.58-79.076-56.73-136.867-133.373-139.887-78.994-3.113-139.462 61.222-141.492 130.457-2.322 79.131 58.282 142.637 135.112 143.157zM882.69 637.08c-12.056 6.033-19.7 16.017-27.846 24.97-11.14 12.238-19.239 8.825-28.517-1.963-7.864-9.147-5.159-15.55 2.119-23.373 25.749-27.683 25.6-27.919 0.169-56.51-7.437-8.36-13.077-16.052-2.718-26.669 9.767-10.008 17.904-9.7 28.378-0.734 9.681 8.285 16.339 23.76 29.467 23.536 13.022-0.223 19.763-15.367 29.145-24.019 9.219-8.502 16.531-7.59 24.984 0.97 8.491 8.601 9.1 15.95 0.542 25.01-8.8 9.32-23.117 16.048-24.648 29.055-1.752 14.887 15.87 18.711 23.842 28.425 8.122 9.896 10.698 18.448 0.346 28.754-10.221 10.177-18.363 6.377-26.649-1.8-5.997-5.919-11.582-12.266-17.73-18.017-3.205-2.997-7.229-5.118-10.884-7.635z"
                fill="#707070" p-id="7754"></path>
          </svg>
          <span>暂无关注，快去关注别人吧！</span>
        </div>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<style scoped>
#followFM >>> .el-dialog {
  border-radius: 20px;
  min-height: 700px;
  background-color: #ffffff;
}

#followFM >>> .el-dialog__body {
  padding: 20px 0;
  max-height: 650px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/*标题*/
#followFM >>> .el-dialog__title {
  font-size: 25px;
  font-family: STXihei, serif;
  font-weight: 900;
  color: #e58c43;
}

.followList {
  width: 100%;
  display: flex;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.5s ease-in-out;
}

.followList:hover {
  background-color: rgba(196, 196, 196, 0.65);
  border-radius: 13px;
  transition: all 0.5s ease-in-out;
}

.fAvatar img {
  height: 80px;
  width: 80px;
  border-radius: 50%;
}

.fNameAndfIntro {
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.fNameAndfIntro span {
  font-family: STXihei, serif;
  color: #414141;
}

.fIntro {
  font-family: STXihei, serif;
  color: rgba(0, 0, 0, 0.6) !important;
  font-size: 12px;
  white-space: nowrap; /*强制单行显示*/
  text-overflow: ellipsis; /*超出部分省略号表示*/
  overflow: hidden; /*超出部分隐藏*/
  width: 250px; /*设置显示的最大宽度*/
  display: inline-block;
}

#messBT {
  display: flex;
  align-items: center;
  margin-left: 20px;
}

.noMessBT {
  min-width: 87px;
  margin-left: 20px;
}

.noFollow {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.noFollow span {
  font-family: STXihei, serif;
  font-size: larger;
}
</style>