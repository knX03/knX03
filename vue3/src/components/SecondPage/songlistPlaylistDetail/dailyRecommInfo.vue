<script setup>
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import {ElMessage, ElNotification} from "element-plus";
import {
  aCollectPlaylist, aDeletePlaylist,
  aDetailByID,
  aIfCollectPlaylist, aIfMy, aIfMyPlaylist,
  aSelectPlaylistTags,
  aSelectUserInfoByID
} from "@/api/api.js";
import router from "@/router/index.js";

const route = useRoute()
let collectBT = ref(true)
let ifCollect = ref(false)
let new_playlist_Cover = ref("")
let colletBUTX = ref("收藏")

let creator = ref({
  ID: '',
  name: '',
  avatar: 'src/photos/logo/avatarWhite.png',
})
let songPlaylists = ref({
  playlist_ID: '',
  create_By: '',
  create_Time: '',
  playlist_Name: '',
  playlist_Cover: '',
  playlist_Introduction: '',
  playlist_Tag: [],
})
let playlistForm = ref({
  playlist_ID: '',
  create_By: '',
  create_Time: '',
  playlist_Name: '',
  playlist_Cover: '',
  playlist_Introduction: '',
  playlist_Tag: [],
})

let songList = ref([{
  song_Name: '',
  singer_ID: '',
  album_ID: '',
  song_cover: '',
}])

//歌单的标签列表
let PLTags = ref([{
  tag_id: '',
  tag_name: '',
}])

//已有的标签列表
const PLTagList = ref([
  {tag_id: '', tag_name: ''}
])

let tagFlag = ref(false)

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

const toPLbyTag = (tag_ID) => {
  router.push({
    path: '/songList',
    query: {tag_ID}
  })
}

onMounted(() => {
  let FPlaylist_ID = 10000
  selectDetail(FPlaylist_ID)
  selectPlaylistTags(FPlaylist_ID)
  editInfo(FPlaylist_ID)
})

/*根据跳转的歌单ID查询歌单详情*/
function selectDetail(data) {
  aDetailByID(data).then(resp => {
    if (resp.data.code === 200) {
      songPlaylists.value = resp.data.data;
      new_playlist_Cover.value = resp.data.data.playlist_Cover;
      playlistForm.value = songPlaylists.value;
      selectCreatorDetail(resp.data.data.create_By)
      ifCollectPlaylist(songPlaylists.value.playlist_ID)
    } else if (resp.data.code === 500) {
      console.log(resp.data.msg)
    }
  })
}

/*查询歌单的标签列表*/
function selectPlaylistTags(playlist_ID) {
  aSelectPlaylistTags(playlist_ID).then(resp => {
    if (resp.data.code === 200) {
      PLTags.value = resp.data.data
    } else {
      console.log(resp.data.Msg)
    }
  })
}

/*创建者详情查询*/
function selectCreatorDetail(create_By) {
  aSelectUserInfoByID(create_By).then(resp => {
    if (resp.data.code === 200) {
      creator.value.ID = resp.data.data.user_ID
      creator.value.name = resp.data.data.user_Name
      creator.value.avatar = resp.data.data.user_Avatar
    } else if (resp.data.code === 500) {
      console.error(resp.data.msg)
    }
  })
}

function editInfo(playlist_ID) {
  aIfMyPlaylist(playlist_ID).then(resp => {
    if (resp.data.code === 200) {
      collectBT.value = !resp.data.data;
    }
  }).catch(resp => {
    collectBT.value = true
  })
}

/*查询歌单是否收藏*/
function ifCollectPlaylist(playlist_ID) {
  aIfCollectPlaylist(playlist_ID).then(resp => {
    if (resp.data.code === 302) {
      ifCollect.value = true;
      colletBUTX.value = "已收藏"
    } else if (resp.data.code === 200) {
      ifCollect.value = false;
    }
  }).catch(resp => {
    console.error(resp)
  })
}

function /*收藏歌单*/
collectPlaylist(row) {
  aCollectPlaylist(row).then(resp => {
    if (resp.data.code === 200) {
      ElMessage.success(resp.data.msg)
      ifCollect.value = true;
      colletBUTX.value = "已收藏"
    } else if (resp.data.code === 500) {
      console.error(resp.data.msg)
    }
  }).catch(resp => {
    ElNotification({
      title: '请先登录!',
      type: 'error'
    })
  })
}

function delColPlaylist(row) {
  aDeletePlaylist(row).then(resp => {
    if (resp.data.code === 200) {
      ifCollect.value = false;
      colletBUTX.value = "收藏"
    } else if (resp.data.code === 500) {
      console.log(resp.data.msg)
    }
  }).catch(resp => {
    ElNotification({
      title: '请先登录!',
      type: 'error'
    })
  })
}
</script>

<template>
  <div class="first_mod">
    <img :src="songPlaylists.playlist_Cover" class="cover_mod">
    <div class="option_mod">
      <div class="basicInfo_mod">
        <span class="playListName_mod">{{ songPlaylists.playlist_Name }}</span>
      </div>
      <div class="plIntroduction_mod"
           v-if="![null,''].includes(songPlaylists.playlist_Introduction)">
        <el-tooltip
            class="box-item"
            :content="songPlaylists.playlist_Introduction"
            placement="bottom"
            effect="light"
        >
          <span>{{ songPlaylists.playlist_Introduction }}</span>
        </el-tooltip>
      </div>
      <div class="userInfo_mod">
        <img :src="creator.avatar" @click="toUserInfo(creator.ID)">
        <span class="userName_mod" @click="toUserInfo(creator.ID)">
          {{ creator.name }}
        </span>
        <div class="playlistTag_mod" v-if="PLTags.length>0">
          <span>标签：</span>
          <label class="tag_mod" v-for="item in PLTags" @click="toPLbyTag(item.tag_id)">
            {{ item.tag_name }}
            <span v-if="PLTags.length>1"> /</span></label>
        </div>
        <span class="creatTime_mod">{{ songPlaylists.create_Time }} 创建</span>
      </div>
      <!--todo 播放和下载功能待实现-->
      <div class="playAndLoad_mod">
        <el-button type="warning">
          <img src="/src/photos/logo/playWhite.png">
          <span>播放全部</span>
        </el-button>
        <el-button type="info">
          <img src="/src/photos/logo/downLoadWhite.png">
          <span>下载</span>
        </el-button>
        <!-- 收藏歌单功能-->
        <div class="collect_mod" v-if="collectBT">
          <el-button type="info" v-if="!ifCollect"
                     @click="collectPlaylist(songPlaylists.playlist_ID)">
            <img src="/src/photos/logo/collect.png">
            {{ colletBUTX }}
          </el-button>
          <el-button type="warning" v-if="ifCollect"
                     @click="delColPlaylist(songPlaylists.playlist_ID)">
            <img src="/src/photos/logo/collect.png">
            {{ colletBUTX }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.first_mod {
  width: 100%;
  height: 250px;
  background-image: linear-gradient(to right, #4b5cc4, #e4c6d0);
}

/*歌单封面*/
.cover_mod {
  width: 200px;
  height: 200px;
  border-radius: 30px;
  position: relative;
  top: 50%;
  left: 18%;
  transform: translate(-50%, -50%);
}

/*选项模块*/
.option_mod {
  height: 224px;
  padding-top: 23px;
  position: absolute;
  top: 79px;
  left: 430px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/*歌单基础信息*/
.basicInfo_mod {
  width: 300px;
  height: 40px;
  display: flex;
  align-items: center;
}

.playListName_mod {
  font-family: STXihei, serif;
  font-size: 30px;
  font-weight: 900;
  color: white;
}

/*简介*/
.plIntroduction_mod {
  font-family: STXihei, serif;
  color: #ffffff;
  font-size: 15px;
}

/*用户信息模块*/
.userInfo_mod {
  min-width: 165px;
  height: 30px;
  display: flex;
  align-items: center;
}

.userInfo_mod img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;

}

.userInfo_mod span {
  font-family: STXihei, serif;
  font-size: 12px;
  color: #ffffff;
}

.userName_mod {
  cursor: pointer;
  margin-left: 15px;
  margin-right: 15px;
}

.playlistTag_mod {
  min-width: 100px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-right: 15px;
}

.tag_mod {
  font-family: STXihei, serif;
  font-size: 12px;
  color: #1b80e4;
  cursor: pointer;
}

.tag_mod:hover {
  color: #5d98da;
}

/*播放和下载按钮*/
.playAndLoad_mod {
  width: 233px;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.playAndLoad_mod span {
  font-family: STXihei, serif;
  color: white;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
}

.playAndLoad_mod img {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.playAndLoad_mod .el-button {
  color: #FFF;
  border-radius: 12px;

}

.playAndLoad_mod .el-button span {
  display: flex;
  align-items: center;
  justify-content: center;
}

/*播放按钮*/
.playAndLoad_mod .el-button--warning {

}

/*下载按钮*/
.playAndLoad_mod .el-button--info {
  color: #FFF;
  backdrop-filter: blur(8px);
  background: #FFFFFF33;
}

/*收藏按钮*/
.collect_mod {
  width: 90px;
  margin-left: 10px;
}

.collect_mod .el-button > span {
  font-family: STXihei, serif;
  color: white;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
}

.collect_mod img {
  width: 20px;
  height: 20px;
}

.collect_mod .el-button {
  color: #FFF;
  border-radius: 12px;
}

.collect_mod .el-button span {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>